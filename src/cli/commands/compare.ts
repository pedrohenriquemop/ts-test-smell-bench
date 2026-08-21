import { Command } from 'commander';
import * as path from 'path';
import { loadConfig } from '../../config/index.ts';
import { buildComparisonMatrix, generateComparisonHtml } from '../../evaluator/compare.ts';
import * as fs from 'fs';

export const compareCommand = new Command('compare')
  .description('Compare F1 scores across different model runs and prompt setups (ablation analysis)')
  .option('-c, --config <path>', 'Path to config file', 'ts-test-smell-bench.config.json')
  .option('-f, --filter <modelId>', 'Only compare runs for a specific model ID')
  .option('--json', 'Also output raw comparison matrix as JSON', false)
  .action(async (options) => {
    try {
      const config = await loadConfig(options.config);
      const outputDir = path.resolve(process.cwd(), config.analyzer.outputDir);

      const matrix = buildComparisonMatrix(outputDir, options.filter);

      if (matrix.runs.length === 0) {
        console.error('No evaluation results found. Run the pipeline first.');
        process.exit(1);
      }

      console.log(`\nFound ${matrix.runs.length} run(s) across ${matrix.smells.length} smell type(s):\n`);

      // Print a text table to console
      const tagWidth = 40;
      const colWidth = 8;

      // Header
      const header = 'Smell'.padEnd(30) + matrix.runs.map((r) => r.tag.slice(-tagWidth).padStart(colWidth)).join(' | ');
      console.log(header);
      console.log('─'.repeat(header.length));

      // Rows
      for (const smell of matrix.smells) {
        const cells = matrix.runs.map((r) => {
          const f1 = matrix.data[smell]?.[r.tag] ?? 0;
          return (f1 * 100).toFixed(1).padStart(colWidth);
        });
        console.log(smell.padEnd(30) + cells.join(' | '));
      }

      // Average row
      console.log('─'.repeat(header.length));
      const avgCells = matrix.runs.map((r) =>
        (matrix.averages[r.tag] * 100).toFixed(1).padStart(colWidth),
      );
      console.log('AVERAGE'.padEnd(30) + avgCells.join(' | '));

      // HTML report
      const htmlPath = path.join(outputDir, 'cross_setup_comparison.html');
      generateComparisonHtml(matrix, htmlPath);

      // JSON output
      if (options.json) {
        const jsonPath = path.join(outputDir, 'cross_setup_comparison.json');
        fs.writeFileSync(jsonPath, JSON.stringify(matrix, null, 2));
        console.log(`📄 JSON matrix saved to ${jsonPath}`);
      }

    } catch (error) {
      console.error('Error during comparison:', error);
      process.exit(1);
    }
  });
