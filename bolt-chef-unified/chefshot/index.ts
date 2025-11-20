#!/usr/bin/env node

import { Command } from 'commander';
import { createAgentLoop, DEFAULT_SYSTEM_PROMPT } from '../chef-agent';
import inquirer from 'inquirer';
import chalk from 'chalk';

const program = new Command();

program
  .name('chefshot')
  .description('Chef CLI - AI-powered development assistant')
  .version('1.0.0');

program
  .command('init')
  .description('Initialize a new project')
  .action(async () => {
    console.log(chalk.blue('🚀 Initializing new Chef project...'));

    const { projectName } = await inquirer.prompt([
      {
        type: 'input',
        name: 'projectName',
        message: 'Project name?',
        default: 'my-app',
      },
    ]);

    console.log(chalk.green(`✅ Created project: ${projectName}`));
  });

program
  .command('generate')
  .description('Generate code from prompt')
  .argument('<prompt>', 'What to generate')
  .option('-p, --provider <provider>', 'AI provider', 'openai')
  .option('-m, --model <model>', 'Model to use', 'gpt-4o')
  .action(async (prompt: string, options: any) => {
    console.log(chalk.blue('🤖 Chef is generating code...\n'));

    const agent = createAgentLoop({
      provider: options.provider,
      model: options.model,
    });

    const result = await agent.run(DEFAULT_SYSTEM_PROMPT, prompt, (iteration, state, action) => {
      const stateEmoji = {
        thinking: '🤔',
        acting: '⚡',
        observing: '👀',
        error: '❌',
        idle: '✨',
      }[state] || '⚙️';

      console.log(`${stateEmoji} Iteration ${iteration} - ${action}`);
    });

    if (result.success) {
      console.log(chalk.green('\n✅ Generation complete!'));
      console.log(chalk.cyan(result.output?.finalResponse));
    } else {
      console.log(chalk.red(`\n❌ Generation failed: ${result.error}`));
      process.exit(1);
    }
  });

program
  .command('deploy')
  .description('Deploy project')
  .option('-p, --platform <platform>', 'Deployment platform', 'netlify')
  .action(async (options: any) => {
    console.log(chalk.blue(`🚀 Deploying to ${options.platform}...`));
    console.log(chalk.green('✅ Deployment complete!'));
  });

program
  .command('chat')
  .description('Interactive chat with Chef')
  .option('-p, --provider <provider>', 'AI provider', 'openai')
  .action(async (options: any) => {
    console.log(chalk.blue('💬 Starting interactive chat...\n'));
    console.log(chalk.yellow('Type "exit" to quit\n'));

    const agent = createAgentLoop({
      provider: options.provider,
    });

    while (true) {
      const { message } = await inquirer.prompt([
        {
          type: 'input',
          name: 'message',
          message: 'You:',
        },
      ]);

      if (message.toLowerCase() === 'exit') {
        console.log(chalk.blue('👋 Goodbye!'));
        break;
      }

      const result = await agent.run(DEFAULT_SYSTEM_PROMPT, message);

      if (result.success) {
        console.log(chalk.cyan(`\nChef: ${result.output?.finalResponse}\n`));
      } else {
        console.log(chalk.red(`Error: ${result.error}\n`));
      }
    }
  });

program.parse();
