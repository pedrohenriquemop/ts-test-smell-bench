import React from 'react';
import { render } from 'ink';
import { Command } from 'commander';
import { loadConfig } from '../../config/index.ts';
import { App } from '../../tui/app.tsx';

export const tuiCommand = new Command('tui')
  .description('Launch the interactive Terminal UI (TUI) for the benchmark pipeline')
  .option('-c, --config <path>', 'Path to config file', 'ts-test-smell-bench.config.json')
  .action(async (options) => {
    try {
      const config = await loadConfig(options.config);

      const { waitUntilExit, unmount } = render(
        <App config={config} onExit={() => unmount()} />
      );
      
      await waitUntilExit();
    } catch (error) {
      console.error('Fatal Error launching TUI:', error);
      process.exit(1);
    }
  });
