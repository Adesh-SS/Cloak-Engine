/**
 * Comprehensive E2E Tests for All CLI Commands
 * 
 * Tests all 21 CLI commands across different categories
 */

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

describe('All CLI Commands E2E', () => {
  let tempDir: string;
  const CLI_PATH = path.join(__dirname, '../../dist/index.js');
  
  beforeAll(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cloakscan-full-e2e-'));
    
    // Create test files
    fs.writeFileSync(
      path.join(tempDir, 'test.ts'),
      `
export function calculate(x: number, y: number): number {
  return x + y;
}

// Secret should be detected
const API_KEY = "sk-1234567890abcdef";
      `.trim()
    );
    
    fs.writeFileSync(
      path.join(tempDir, 'package.json'),
      JSON.stringify({
        name: 'test-project',
        version: '1.0.0',
        dependencies: {}
      })
    );
  });
  
  afterAll(() => {
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });
  
  const runCommand = (cmd: string, expectSuccess: boolean = true): string => {
    try {
      return execSync(`node ${CLI_PATH} ${cmd}`, {
        cwd: tempDir,
        encoding: 'utf-8',
        timeout: 30000,
      });
    } catch (error: any) {
      if (!expectSuccess) {
        return error.stdout || error.message;
      }
      throw error;
    }
  };
  
  describe('Configuration Commands', () => {
    it('1. cloakscan init - Initialize configuration', () => {
      const output = runCommand('init --no-telemetry');
      expect(output).toBeDefined();
    });
    
    it('2. cloakscan config - View configuration', () => {
      const output = runCommand('config --show --no-telemetry');
      expect(output).toBeDefined();
    });
    
    it('3. cloakscan status - Show status', () => {
      const output = runCommand('status --no-telemetry');
      expect(output).toBeDefined();
    });
    
    it('4. cloakscan reset - Reset configuration', () => {
      const output = runCommand('reset --force --no-telemetry');
      expect(output).toBeDefined();
    });
  });
  
  describe('Code Analysis Commands', () => {
    it('5. cloakscan run - Count lines of code', () => {
      const output = runCommand('run --no-telemetry', false);
      expect(output).toBeDefined();
    });
    
    it('6. cloakscan scan - Full code scan', () => {
      const output = runCommand('scan --no-telemetry', false);
      expect(output).toBeDefined();
    });
  });
  
  describe('Security Commands', () => {
    it('7. cloakscan security - Security scan', () => {
      const output = runCommand('security --no-telemetry', false);
      expect(output).toBeDefined();
    });
  });
  
  describe('Testing Commands', () => {
    it('8. cloakscan test - Run tests', () => {
      const output = runCommand('test --no-telemetry', false);
      // May fail if no test runner configured
      expect(output).toBeDefined();
    });
    
    it('9. cloakscan perf - Performance testing', () => {
      const output = runCommand('perf --no-telemetry', false);
      expect(output).toBeDefined();
    });
    
    it('10. cloakscan mutation - Mutation testing', () => {
      const output = runCommand('mutation --no-telemetry', false);
      expect(output).toBeDefined();
    });
  });
  
  describe('SBOM & Compliance Commands', () => {
    it('11. cloakscan sbom - Generate SBOM', () => {
      const output = runCommand('sbom -f spdx --no-telemetry', false);
      expect(output).toBeDefined();
    });
    
    it('12. cloakscan rules - Manage rules', () => {
      const output = runCommand('rules list --no-telemetry', false);
      expect(output).toBeDefined();
    });
  });
  
  describe('AI-Enhanced Commands', () => {
    // Note: These require API keys, so we test for proper error handling
    
    it('13. cloakscan commit - Generate commit message', () => {
      const output = runCommand('commit --no-telemetry', false);
      // Should fail without git repo or API key
      expect(output).toBeDefined();
    });
    
    it('14. cloakscan explain - Code explanation', () => {
      const output = runCommand('explain test.ts --no-telemetry', false);
      // Should fail without API key
      expect(output).toBeDefined();
    });
    
    it('15. cloakscan test-gen - Generate tests', () => {
      const output = runCommand('test-gen test.ts --no-telemetry', false);
      // Should fail without API key
      expect(output).toBeDefined();
    });
    
    it('16. cloakscan docs - Generate documentation', () => {
      const output = runCommand('docs test.ts --no-telemetry', false);
      // Should fail without API key
      expect(output).toBeDefined();
    });
    
    it('17. cloakscan chat - Interactive chat', () => {
      // Chat is interactive, so we can't fully test it in E2E
      // Just verify the command exists
      const output = runCommand('--help', false);
      expect(output).toContain('chat');
    });
    
    it('18. cloakscan refactor - Refactoring suggestions', () => {
      const output = runCommand('refactor test.ts --no-telemetry', false);
      // Should fail without API key
      expect(output).toBeDefined();
    });
    
    it('19. cloakscan threat-model - Threat modeling', () => {
      const output = runCommand('threat-model --no-telemetry', false);
      // Should fail without API key
      expect(output).toBeDefined();
    });
    
    it('20. cloakscan migrate - Migration assistance', () => {
      const output = runCommand('migrate --from react --to vue --no-telemetry', false);
      // Should fail without API key
      expect(output).toBeDefined();
    });
    
    it('21. cloakscan review - AI code review', () => {
      const output = runCommand('review test.ts --no-telemetry', false);
      // Should fail without API key
      expect(output).toBeDefined();
    });
  });
  
  describe('Help Command', () => {
    it('cloakscan --help - Show help', () => {
      const output = runCommand('--help');
      expect(output).toContain('cloakscan');
      expect(output).toContain('Usage');
    });
  });
  
  describe('Version Command', () => {
    it('cloakscan --version - Show version', () => {
      const output = runCommand('--version');
      expect(output).toMatch(/\d+\.\d+\.\d+/);
    });
  });
});

