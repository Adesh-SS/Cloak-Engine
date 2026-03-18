import chalk from 'chalk';
import * as fs from 'fs';
import * as path from 'path';
import { configManager } from '../core/config';
import { repositoryManager } from '../core/repository';
import { ProviderFactory } from '../providers/factory';
import { createDebugLogger } from '../utils/debug-logger';
import { createPerformanceTracker } from '../utils/performance-tracker';
import { handleCommandError } from '../utils/error-handler';

const logger = createDebugLogger('explain');
const perfTracker = createPerformanceTracker('cloakscan explain');
import { CodeExplainer, ExplanationLevel, ExplanationTarget } from '../features/code-explainer';
import { CodebaseIndexer } from '../core/codebase-indexer';
import { AICache } from '../core/ai-cache';

interface ExplainOptions {
  level?: string;
  type?: string;
  output?: string;
}

/**
 * Recursively search for a file by basename within a directory tree.
 * Skips common noise directories (node_modules, .git, dist, build, etc.)
 */
function findFileInTree(dir: string, basename: string): string | null {
  const SKIP_DIRS = new Set(['node_modules', '.git', 'dist', 'build', 'out', '.next', 'coverage']);
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        if (SKIP_DIRS.has(entry.name)) continue;
        const found = findFileInTree(path.join(dir, entry.name), basename);
        if (found) return found;
      } else if (entry.name === basename) {
        return path.join(dir, entry.name);
      }
    }
  } catch {
    // Ignore permission errors etc.
  }
  return null;
}

export async function explainCommand(target: string, options: ExplainOptions): Promise<void> {
  logger.debug('Explain command started', { target, options });
  perfTracker.start('explain-total');
  
  try {
    // Load config
    perfTracker.start('load-config');
    const config = configManager.loadOrInit();
    perfTracker.end('load-config');
    logger.debug('Config loaded', { provider: config.provider });

    // Get repository info
    const repoInfo = repositoryManager.getRepoInfo();
    const repoRoot = repoInfo.path;

    console.log(chalk.blue(`🤖 Explaining: ${target}...`));

    // Check if AI provider is configured
    if (!config.provider || config.provider === 'none' || !config.apiKey) {
      console.log(chalk.yellow('\n⚠ AI provider not configured. Run `cloakscan config` to set up.'));
      return;
    }

    // Validate level
    const level = (options.level?.toLowerCase() || 'detailed') as ExplanationLevel;
    if (!['brief', 'detailed', 'comprehensive'].includes(level)) {
      handleCommandError(new Error('Invalid level. Must be: brief, detailed, or comprehensive'), 'Explain');
    }

    // Auto-detect type if not explicitly provided
    let type: ExplanationTarget;
    if (options.type) {
      type = options.type.toLowerCase() as ExplanationTarget;
    } else {
      // Auto-detect: if target looks like a file path (has extension), treat as file
      const hasExtension = /\.\w+$/.test(target);
      const isFilePath = hasExtension || target.includes(path.sep) || target.includes('/');
      type = isFilePath ? 'file' : 'function';
    }
    if (!['function', 'class', 'file', 'module'].includes(type)) {
      handleCommandError(new Error('Invalid type. Must be: function, class, file, or module'), 'Explain');
    }

    // Create AI provider
    const provider = ProviderFactory.create(config.provider, config.apiKey, config.apiEndpoint, config.model);

    // Create AI cache
    const cache = new AICache(repoInfo.repoId, 100); // 100MB cache

    // Create indexer
    const indexer = new CodebaseIndexer(repoRoot, repoInfo.repoId);

    // Create explainer
    const explainer = new CodeExplainer(provider, indexer, cache, repoRoot);

    // Generate explanation based on type
    let explanation;

    try {
      if (type === 'function') {
        explanation = await explainer.explainFunction(target, level);
      } else if (type === 'class') {
        explanation = await explainer.explainClass(target, level);
      } else if (type === 'file') {
        // Resolve file path: try absolute, then CWD-relative, then search the repo
        let filePath: string;
        if (path.isAbsolute(target)) {
          filePath = target;
        } else {
          const cwdPath = path.join(process.cwd(), target);
          const repoPath = path.join(repoRoot, target);
          if (fs.existsSync(cwdPath)) {
            filePath = cwdPath;
          } else if (fs.existsSync(repoPath)) {
            filePath = repoPath;
          } else {
            // Search the repo tree for a file matching the basename
            const match = findFileInTree(repoRoot, path.basename(target));
            if (match) {
              filePath = match;
              console.log(chalk.gray(`  Found: ${path.relative(repoRoot, match)}`));
            } else {
              throw new Error(`File not found: "${target}" — not found anywhere in ${repoRoot}`);
            }
          }
        }
        explanation = await explainer.explainFile(filePath, level);
      } else {
        // module/theme
        explanation = await explainer.explainTheme(target, level);
      }
    } catch (error: any) {
      handleCommandError(error, `Explain ${type}`);
    }

    // Format and display explanation
    const formattedExplanation = explainer.formatExplanation(explanation);

    console.log(chalk.white.bold('\n📖 Code Explanation:\n'));
    console.log(chalk.cyan('─'.repeat(60)));
    console.log(formattedExplanation);
    console.log(chalk.cyan('─'.repeat(60)));

    // Save to file if requested
    if (options.output) {
      const outputPath = path.isAbsolute(options.output)
        ? options.output
        : path.join(repoRoot, options.output);

      fs.writeFileSync(outputPath, formattedExplanation, 'utf-8');
      console.log(chalk.green(`\n✓ Explanation saved to: ${outputPath}`));
    }

    // Display statistics
    console.log(chalk.gray(`\nLevel: ${explanation.level}`));
    console.log(chalk.gray(`Type: ${explanation.type}`));

    if (explanation.complexity) {
      console.log(chalk.gray(`Complexity: ${explanation.complexity}`));
    }

    if (explanation.patterns && explanation.patterns.length > 0) {
      console.log(chalk.gray(`Patterns found: ${explanation.patterns.length}`));
    }

    console.log();

  } catch (error) {
    handleCommandError(error, 'Explain');
  }
}
