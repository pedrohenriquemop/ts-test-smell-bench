import { Command } from 'commander';
import { loadConfig } from '../../config/index.ts';
import { runAnalyzer } from '../../analyzer/index.ts';
import { createProvider } from '../../analyzer/providers/index.ts';
import { resolveSmells } from '../../smells/catalog.ts';
import { buildSystemPrompt } from '../../smells/prompt-builder.ts';

export const analyzeCommand = new Command('analyze')
  .description('Analyze test smells and compare with reference baseline')
  .option('-c, --config <path>', 'Path to config file', 'ts-test-smell-bench.config.json')
  .option('--num-tests <number>', 'Override number of tests to analyze')
  .option('--model <name>', 'Override model ID (must match an entry in config models[])')
  .option('-v, --version-suffix <version>', 'Version suffix for the output files')
  .action(async (options) => {
    try {
      const config = await loadConfig(options.config);
      const analyzerConfig = config.analyzer;
      
      if (options.numTests) analyzerConfig.numTests = parseInt(options.numTests, 10);
      if (options.versionSuffix) analyzerConfig.version = options.versionSuffix;

      // ── Resolve model ──────────────────────────────────────────
      const models = config.models ?? [];
      const modelId = options.model ?? models[0]?.id;

      if (!modelId || models.length === 0) {
        console.error('Error: No models configured. Add a "models" array to your config file.');
        process.exit(1);
      }

      const modelConfig = models.find((m) => m.id === modelId);
      if (!modelConfig) {
        const known = models.map((m) => m.id).join(', ');
        console.error(`Error: Model "${modelId}" not found in config. Available: ${known}`);
        process.exit(1);
      }

      const provider = createProvider(modelConfig);

      // ── Resolve smells & build prompt ──────────────────────────
      const smellIds = config.smells?.enabled ?? [];
      const smells = resolveSmells(smellIds);
      const systemPrompt = buildSystemPrompt(smells);

      console.log(`Using model:  ${provider.name}`);
      console.log(`Smells (${smells.length}): ${smells.map((s) => s.displayName).join(', ')}`);

      await runAnalyzer({
        config: analyzerConfig,
        provider,
        systemPrompt,
      });
    } catch (error) {
      console.error('Error during analysis:', error);
      process.exit(1);
    }
  });
