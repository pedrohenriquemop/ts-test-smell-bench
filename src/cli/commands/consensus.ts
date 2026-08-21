import { Command } from 'commander';
import * as path from 'path';
import { loadConfig } from '../../config/index.ts';
import { buildConsensus } from '../../consensus/index.ts';

export const consensusCommand = new Command('consensus')
  .description('Build a consensus goldset from multiple model runs using majority voting')
  .option('-c, --config <path>', 'Path to config file', 'ts-test-smell-bench.config.json')
  .option('--tags <tags...>', 'Version tags of model runs to include (e.g. llama3-local__standard-ast-ctx gemini-flash__standard-ast-ctx)')
  .option('-t, --threshold <number>', 'Fraction of models that must agree (0.0 - 1.0)', '0.5')
  .option('-o, --output <path>', 'Output path for consensus goldset', 'goldset/consensus.txt')
  .option('--report', 'Also generate a disagreement report JSON', false)
  .action(async (options) => {
    try {
      const config = await loadConfig(options.config);
      const outputDir = path.resolve(process.cwd(), config.analyzer.outputDir);

      // If no tags specified, try to auto-discover from output dir
      let tags: string[] = options.tags ?? [];
      if (tags.length === 0) {
        const fs = await import('fs');
        const files = fs.readdirSync(outputDir);
        tags = files
          .filter((f: string) => f.startsWith('comparison_results_v') && f.endsWith('.json'))
          .map((f: string) => f.replace('comparison_results_v', '').replace('.json', ''));

        if (tags.length === 0) {
          console.error('No comparison results found. Run the analyze stage first.');
          process.exit(1);
        }
        console.log(`Auto-discovered ${tags.length} result sets: ${tags.join(', ')}`);
      }

      buildConsensus({
        resultsDir: outputDir,
        versionTags: tags,
        threshold: parseFloat(options.threshold),
        outputPath: path.resolve(process.cwd(), options.output),
        writeReport: options.report,
      });

    } catch (error) {
      console.error('Error building consensus:', error);
      process.exit(1);
    }
  });
