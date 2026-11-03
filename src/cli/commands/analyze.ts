import { Command } from "commander";
import { DEFAULT_CONFIG_PATH, findModel, loadConfig } from "../../config/index.ts";
import { runAnalyzer } from "../../analyzer/index.ts";
import { createProvider } from "../../analyzer/providers/index.ts";
import { resolveSmells } from "../../smells/catalog.ts";
import { buildSystemPrompt } from "../../smells/prompt-builder.ts";

export const analyzeCommand = new Command("analyze")
  .description("Run one model over the goldset tests and save its predictions")
  .option("-c, --config <path>", "Path to config file", DEFAULT_CONFIG_PATH)
  .option("--num-tests <number>", "Override number of tests to analyze")
  .option("--model <id>", "Model ID from config models[] (defaults to the first)")
  .option("-v, --version-suffix <version>", "Version suffix for the output files")
  .action(async (options) => {
    const config = await loadConfig(options.config);
    if (options.numTests) config.analyzer.numTests = parseInt(options.numTests, 10);
    if (options.versionSuffix) config.analyzer.version = options.versionSuffix;

    const modelId = options.model ?? config.models[0]?.id;
    if (!modelId) throw new Error('No models configured. Add a "models" array to your config file.');
    const provider = createProvider(findModel(config, modelId));
    const smells = resolveSmells(config.smells.enabled);

    console.log(`Using model:  ${provider.name}`);
    console.log(`Smells (${smells.length}): ${smells.map((s) => s.displayName).join(", ")}`);

    await runAnalyzer({
      config: config.analyzer,
      provider,
      systemPrompt: buildSystemPrompt(smells, config.prompt),
      promptConfig: config.prompt,
    });
  });
