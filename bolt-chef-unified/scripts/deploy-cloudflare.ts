#!/usr/bin/env node

import { execSync } from 'child_process';
import chalk from 'chalk';

console.log(chalk.blue('🚀 Deploying to Cloudflare Pages...\n'));

try {
  console.log(chalk.yellow('Building project...'));
  execSync('npm run build', { stdio: 'inherit' });

  console.log(chalk.yellow('\nDeploying to Cloudflare Pages...'));
  execSync('npx wrangler pages deploy dist --project-name=bolt-chef-unified', {
    stdio: 'inherit',
  });

  console.log(chalk.green('\n✅ Deployment complete!'));
  console.log(chalk.cyan('\n🌐 Your site is live at:'));
  console.log(chalk.blue('https://bolt-chef-unified.pages.dev'));
} catch (error: any) {
  console.error(chalk.red('\n❌ Deployment failed:'));
  console.error(error.message);
  process.exit(1);
}
