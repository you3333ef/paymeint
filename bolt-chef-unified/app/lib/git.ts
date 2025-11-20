import { GitStatus, FileChange } from '@/types';

export interface GitConfig {
  name: string;
  email: string;
}

export class GitManager {
  private basePath: string;

  constructor(basePath: string = '/tmp/project') {
    this.basePath = basePath;
  }

  async initRepo(): Promise<{ success: boolean; error?: string }> {
    try {
      await this.runCommand('git', ['init'], this.basePath);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async configureGit(config: GitConfig): Promise<{ success: boolean; error?: string }> {
    try {
      await this.runCommand('git', ['config', 'user.name', config.name], this.basePath);
      await this.runCommand('git', ['config', 'user.email', config.email], this.basePath);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async addFile(filePath: string): Promise<{ success: boolean; error?: string }> {
    try {
      await this.runCommand('git', ['add', filePath], this.basePath);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async addAll(): Promise<{ success: boolean; error?: string }> {
    try {
      await this.runCommand('git', ['add', '.'], this.basePath);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async commit(message: string): Promise<{ success: boolean; error?: string; commitHash?: string }> {
    try {
      const result = await this.runCommand('git', ['commit', '-m', message], this.basePath);
      const hash = await this.getCurrentCommitHash();
      return { success: true, commitHash: hash };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async getStatus(): Promise<GitStatus> {
    try {
      const branch = await this.runCommand('git', ['rev-parse', '--abbrev-ref', 'HEAD'], this.basePath);
      const status = await this.runCommand('git', ['status', '--porcelain'], this.basePath);

      const changes: FileChange[] = status
        .split('\n')
        .filter(line => line.trim())
        .map(line => {
          const statusCode = line.substring(0, 2).trim();
          const filePath = line.substring(3).trim();

          let type: 'added' | 'modified' | 'deleted' = 'modified';
          if (statusCode.startsWith('A')) type = 'added';
          else if (statusCode.startsWith('D')) type = 'deleted';
          else if (statusCode.startsWith('M')) type = 'modified';

          return { type, path: filePath };
        });

      return {
        branch: branch.trim(),
        ahead: 0,
        behind: 0,
        changes,
      };
    } catch (error: any) {
      console.error('Error getting git status:', error);
      return {
        branch: 'main',
        ahead: 0,
        behind: 0,
        changes: [],
      };
    }
  }

  async getCurrentCommitHash(): Promise<string | null> {
    try {
      const hash = await this.runCommand('git', ['rev-parse', 'HEAD'], this.basePath);
      return hash.trim() || null;
    } catch {
      return null;
    }
  }

  async createBranch(branchName: string): Promise<{ success: boolean; error?: string }> {
    try {
      await this.runCommand('git', ['checkout', '-b', branchName], this.basePath);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async switchBranch(branchName: string): Promise<{ success: boolean; error?: string }> {
    try {
      await this.runCommand('git', ['checkout', branchName], this.basePath);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async getDiff(filePath: string): Promise<string> {
    try {
      const diff = await this.runCommand('git', ['diff', 'HEAD', filePath], this.basePath);
      return diff;
    } catch (error: any) {
      return '';
    }
  }

  async stageAndCommitAll(message: string): Promise<{ success: boolean; error?: string }> {
    const addResult = await this.addAll();
    if (!addResult.success) {
      return addResult;
    }
    return await this.commit(message);
  }

  private async runCommand(command: string, args: string[], cwd?: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const { exec } = require('child_process');
      exec(`${command} ${args.join(' ')}`, { cwd }, (error: Error | null, stdout: string, stderr: string) => {
        if (error) {
          reject(error);
        } else {
          resolve(stdout);
        }
      });
    });
  }
}

export const gitManager = new GitManager();
