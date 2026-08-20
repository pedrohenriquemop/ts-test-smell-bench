import { Command } from 'commander';
import { loadConfig } from '../../config/index.ts';
import { runPipeline } from '../../pipeline/index.ts';

export const runCommand = new Command('run')
  .description('Run the full end-to-end pipeline (mine, prepare, analyze, evaluate)')
  .option('-c, --config <path>', 'Path to config file', 'ts-test-smell-bench.config.json')
  .option('--skip-mine', 'Skip the mining stage')
  .option('--skip-prepare', 'Skip the prepare stage')
  .option('--skip-analyze', 'Skip the analyze stage')
  .option('--skip-evaluate', 'Skip the evaluate stage')
  .option('-m, --models <ids...>', 'Specific model IDs to run (space separated). Defaults to all configured models.')
  .action(async (options) => {
    try {
      const config = await loadConfig(options.config);

      console.log(`🚀 Starting ts-test-smell-bench pipeline...`);
      
      const startTime = Date.now();
      let currentStageStart = Date.now();

      await runPipeline({
        config,
        stages: {
          mine: !options.skipMine,
          prepare: !options.skipPrepare,
          analyze: !options.skipAnalyze,
          evaluate: !options.skipEvaluate,
        },
        modelIds: options.models,
        onStageStart: (stage, modelId) => {
          currentStageStart = Date.now();
          const target = modelId ? ` for model [${modelId}]` : '';
          console.log(`\n▶️  [STAGE START] ${stage.toUpperCase()}${target}...`);
        },
        onStageComplete: (stage, modelId) => {
          const elapsed = ((Date.now() - currentStageStart) / 1000).toFixed(1);
          const target = modelId ? ` for model [${modelId}]` : '';
          console.log(`\n✅ [STAGE DONE] ${stage.toUpperCase()}${target} (took ${elapsed}s)`);
        },
        onStageError: (stage, error, modelId) => {
          const target = modelId ? ` for model [${modelId}]` : '';
          console.error(`\n❌ [STAGE ERROR] ${stage.toUpperCase()}${target}:`);
          console.error(error.message || error);
          // Abort the pipeline on error in CLI mode
          return false;
        }
      });

      const totalElapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      console.log(`\n🎉 All requested stages completed in ${totalElapsed}s.`);
      
    } catch (error: unknown) {
      console.error('\n💥 Pipeline aborted due to error:');
      console.error(error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  });
