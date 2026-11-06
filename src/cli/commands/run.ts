import * as readline from "readline";
import { Command, Option } from "commander";
import { DEFAULT_CONFIG_PATH, loadConfig, type AppConfig } from "../../config/index.ts";
import { runPipeline, type EvaluationRun } from "../../pipeline/index.ts";

type FlagMode = "on" | "off" | "both";

const flagValues = (mode: FlagMode | undefined, configValue: boolean): boolean[] =>
  mode === "both" ? [true, false] : mode ? [mode === "on"] : [configValue];

/** Every local model (or those in `modelIds`) × the requested CoT/AST values. */
function evaluationRuns(
  config: AppConfig,
  modelIds: string[] | undefined,
  cot: FlagMode | undefined,
  ast: FlagMode | undefined,
): EvaluationRun[] {
  const localIds = config.models
    .filter((m) => m.provider === "ollama" && (!modelIds?.length || modelIds.includes(m.id)))
    .map((m) => m.id);
  return localIds.flatMap((modelId) =>
    flagValues(cot, config.prompt.useChainOfThought).flatMap((useChainOfThought) =>
      flagValues(ast, config.prompt.includeAstMetrics).map((includeAstMetrics) => ({
        modelId,
        useChainOfThought,
        includeAstMetrics,
      })),
    ),
  );
}

function askYesNo(message: string): Promise<boolean> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(`\n❓ ${message} (y/n) `, (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase() === "y");
    });
  });
}

export const runCommand = new Command("run")
  .description("Run the end-to-end pipeline (mine, prepare, goldset, evaluate, metrics)")
  .option("-c, --config <path>", "Path to config file", DEFAULT_CONFIG_PATH)
  .option("--skip-mine", "Skip the mining stage")
  .option("--skip-prepare", "Skip the prepare stage")
  .option("--skip-analyze", "Skip the goldset generation stage")
  .option("--skip-evaluate", "Skip running the local models")
  .option("--skip-sanitize", "Skip the model-smell sanitization stage")
  .option("--skip-metrics", "Skip the metrics generation stage")
  .option("-m, --models <ids...>", "Model IDs to run. Defaults to all configured models.")
  .addOption(
    new Option("--cot <mode>", "Chain-of-thought for the local-model runs (default: config)").choices(["on", "off", "both"]),
  )
  .addOption(
    new Option("--ast <mode>", "AST metrics for the local-model runs (default: config)").choices(["on", "off", "both"]),
  )
  .action(async (options) => {
    const config = await loadConfig(options.config);
    console.log("🚀 Starting ts-test-smell-bench pipeline...");

    const startTime = Date.now();
    let stageStart = startTime;
    const target = (modelTag?: string) => (modelTag ? ` for model [${modelTag}]` : "");

    await runPipeline({
      config,
      stages: {
        mine: !options.skipMine,
        prepare: !options.skipPrepare,
        analyze: !options.skipAnalyze,
        evaluate: !options.skipEvaluate,
        sanitize: !options.skipSanitize,
        generateMetrics: !options.skipMetrics,
      },
      modelIds: options.models,
      evaluationRuns: evaluationRuns(config, options.models, options.cot, options.ast),
      onStageStart: (stage, modelTag) => {
        stageStart = Date.now();
        console.log(`\n▶️  [STAGE START] ${stage.toUpperCase()}${target(modelTag)}...`);
      },
      onStageComplete: (stage, modelTag) => {
        const elapsed = ((Date.now() - stageStart) / 1000).toFixed(1);
        console.log(`\n✅ [STAGE DONE] ${stage.toUpperCase()}${target(modelTag)} (took ${elapsed}s)`);
      },
      onStageError: (stage, error, modelTag) => {
        console.error(`\n❌ [STAGE ERROR] ${stage.toUpperCase()}${target(modelTag)}:`);
        console.error(error.message || error);
        return false;
      },
      onPrompt: askYesNo,
    });

    const totalElapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`\n🎉 All requested stages completed in ${totalElapsed}s.`);
  });
