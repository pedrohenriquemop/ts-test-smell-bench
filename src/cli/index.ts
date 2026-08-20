import { Command } from 'commander';
import { mineCommand } from './commands/mine.ts';
import { prepareCommand } from './commands/prepare.ts';
import { analyzeCommand } from './commands/analyze.ts';
import { evaluateCommand } from './commands/evaluate.ts';
import { runCommand } from './commands/run.ts';
import { tuiCommand } from './commands/tui.tsx';

const program = new Command();

program
  .name('ts-test-smell-bench')
  .description('CLI to mine and analyze TypeScript test smells')
  .version('1.0.0');

program.addCommand(mineCommand);
program.addCommand(prepareCommand);
program.addCommand(analyzeCommand);
program.addCommand(evaluateCommand);
program.addCommand(runCommand);
program.addCommand(tuiCommand);

program.parseAsync(process.argv).catch((err) => {
  console.error('Fatal Error:', err);
  process.exit(1);
});
