import chalk from 'chalk';
import { configManager } from '../core/config';
import { repositoryManager } from '../core/repository';
import { apiClient } from '../utils/api-client';
import { isOnline } from '../utils/network';
import { displaySimpleBanner } from '../utils/ascii-art';
import ora from 'ora';
import { createDebugLogger } from '../utils/debug-logger';
import { createPerformanceTracker } from '../utils/performance-tracker';
import { handleCommandError } from '../utils/error-handler';

const logger = createDebugLogger('status');
const perfTracker = createPerformanceTracker('cloakscan status');

export async function statusCommand(): Promise<void> {
  logger.debug('Status command started');
  perfTracker.start('status-total');
  
  displaySimpleBanner('status');

  try {
    // Load config
    perfTracker.start('load-config');
    const config = configManager.loadOrInit();
    perfTracker.end('load-config');
    logger.debug('Config loaded', { provider: config.provider });

    // Get repository info
    let repoInfo;
    try {
      repoInfo = repositoryManager.getRepoInfo();
    } catch {
      // Not in a repository
    }

    // Display configuration
    console.log(chalk.cyan.bold('⚙️  Configuration:'));
    console.log(chalk.gray(`  Client ID:   `) + chalk.white(config.clientId));
    console.log(chalk.gray(`  Provider:    `) + chalk.white(config.provider));
    console.log(chalk.gray(`  Telemetry:   `) + chalk.white(config.telemetryEnabled ? 'Enabled' : 'Disabled'));
    console.log(chalk.gray(`  Offline Mode:`) + chalk.white(config.offlineMode ? 'Yes' : 'No'));

    // Display repository info
    if (repoInfo) {
      console.log(chalk.cyan.bold('\n📁 Repository:'));
      console.log(chalk.gray(`  Name:    `) + chalk.white(repoInfo.name));
      console.log(chalk.gray(`  Path:    `) + chalk.white(repoInfo.path));
      console.log(chalk.gray(`  Type:    `) + chalk.white(repoInfo.isGit ? 'Git' : 'Standard'));
      if (repoInfo.branch) {
        console.log(chalk.gray(`  Branch:  `) + chalk.white(repoInfo.branch));
      }
      console.log(chalk.gray(`  Repo ID: `) + chalk.white(repoInfo.repoId));
    }

    // Check network connectivity
    console.log(chalk.cyan.bold('\n🌐 Connectivity:'));
    const online = await isOnline();
    console.log(chalk.gray(`  Internet: `) + (online ? chalk.green('Connected') : chalk.red('Offline')));

    // CloakScan is now 100% free and open source!
    console.log(chalk.cyan.bold('\n📄 License:'));
    console.log(chalk.gray('  ✓ Unlimited static analysis (offline)'));
    console.log(chalk.gray('  ✓ AI review with your own API key (BYOK)'));
    console.log(chalk.gray('  ✓ No usage limits or subscriptions'));

    console.log();
  } catch (error) {
    handleCommandError(error, 'Status check');
  }
}
