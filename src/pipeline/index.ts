import * as fs from "fs";
import * as path from "path";
import {
  findModel,
  promptSetupTag,
  type AppConfig,
  type ModelConfig,
} from "../config/index.ts";
import { Miner } from "../miner/index.ts";
import { prepareLlmLabelingDataset } from "../dataset/index.ts";
import {
  generateGoldset,
  runAnalyzer,
  type PromptHandler,
} from "../analyzer/index.ts";
import { createProvider } from "../analyzer/providers/index.ts";
import { resolveSmells } from "../smells/catalog.ts";
import { buildSystemPrompt } from "../smells/prompt-builder.ts";
import { evaluateResults } from "../evaluator/index.ts";
import { generateHumanEvaluation } from "../human-evaluation/index.ts";
import { mergeGoldsetRuns } from "../goldset/merge.ts";
import { sanitizeComparisonResults } from "../sanitizer/index.ts";

/**
 * `analyze` labels the goldset with one cloud model; `evaluate` runs the
 * local models against it; `sanitize` and `generateMetrics` post-process
 * those runs.
 */
export interface PipelineStages {
  mine: boolean;
  prepare: boolean;
  humanEvaluation: boolean;
  analyze: boolean;
  mergeGoldset: boolean;
  evaluate: boolean;
  sanitize: boolean;
  generateMetrics: boolean;
}

export type StageName = keyof PipelineStages;

export interface PipelineOptions {
  config: AppConfig;
  stages?: Partial<PipelineStages>;
  /** Model IDs to run; defaults to every configured model. */
  modelIds?: string[];
  onStageStart?: (stage: StageName, modelTag?: string) => void;
  onStageComplete?: (stage: StageName, modelTag?: string) => void;
  /** Return true to continue with the next stage, false to abort. */
  onStageError?: (stage: StageName, error: Error, modelTag?: string) => boolean;
  onPrompt?: PromptHandler;
}

const DEFAULT_STAGES: PipelineStages = {
  mine: true,
  prepare: true,
  humanEvaluation: false,
  analyze: true,
  mergeGoldset: false,
  evaluate: true,
  sanitize: true,
  generateMetrics: true,
};

export async function runPipeline(opts: PipelineOptions): Promise<void> {
  const { config } = opts;
  const stages = { ...DEFAULT_STAGES, ...opts.stages };

  const runStage = async (stage: StageName, action: () => unknown, modelTag?: string) => {
    opts.onStageStart?.(stage, modelTag);
    try {
      await action();
      opts.onStageComplete?.(stage, modelTag);
    } catch (err) {
      if (!opts.onStageError?.(stage, err as Error, modelTag)) throw err;
    }
  };

  const systemPrompt = () =>
    buildSystemPrompt(resolveSmells(config.smells.enabled), config.prompt);
  const localModels = () =>
    selectModels(config, opts.modelIds).filter((m) => m.provider === "ollama");
  const runVersion = (model: ModelConfig) => `${model.id}__${promptSetupTag(config.prompt)}`;
  const versionedAnalyzer = (model: ModelConfig) => ({
    ...config.analyzer,
    version: runVersion(model),
  });

  if (stages.mine) {
    await runStage("mine", () => new Miner(config.miner).run());
  }

  if (stages.prepare) {
    await runStage("prepare", () =>
      prepareLlmLabelingDataset(config.dataset, config.miner.outputDir || "tests"),
    );
  }

  if (stages.humanEvaluation) {
    await runStage("humanEvaluation", () => generateHumanEvaluation());
  }

  if (stages.analyze) {
    const cloudModels = selectModels(config, opts.modelIds).filter((m) => m.provider !== "ollama");
    if (cloudModels.length !== 1) {
      throw new Error("Select exactly one cloud model to generate the shared goldset.");
    }
    const [model] = cloudModels;
    await runStage(
      "analyze",
      () => {
        const provider = createProvider(model);
        logRunHeader(provider.name, config);
        return generateGoldset({
          config: config.analyzer,
          provider,
          systemPrompt: systemPrompt(),
          promptConfig: config.prompt,
          onPrompt: opts.onPrompt,
        });
      },
      model.id,
    );
  }

  if (stages.mergeGoldset) {
    await runStage("mergeGoldset", () => mergeGoldsetRuns());
  }

  if (stages.evaluate) {
    for (const model of localModels()) {
      await runStage(
        "evaluate",
        () =>
          runAnalyzer({
            config: versionedAnalyzer(model),
            provider: createProvider(model),
            systemPrompt: systemPrompt(),
            promptConfig: config.prompt,
            onPrompt: opts.onPrompt,
          }),
        runVersion(model),
      );
    }
  }

  if (stages.sanitize) {
    for (const model of localModels()) {
      await runStage(
        "sanitize",
        () => sanitizeComparisonResults(versionedAnalyzer(model)),
        runVersion(model),
      );
    }
  }

  if (stages.generateMetrics) {
    const models = localModels();
    for (const model of models) {
      await runStage(
        "generateMetrics",
        () => evaluateResults(versionedAnalyzer(model)),
        runVersion(model),
      );
    }
    if (models.length > 1) writeCrossModelSummary(config, models.map(runVersion));
  }

  console.log("\n✅ Pipeline complete.");
}

function selectModels(config: AppConfig, modelIds?: string[]): ModelConfig[] {
  if (config.models.length === 0) {
    throw new Error('No models configured. Add a "models" array to your config file.');
  }
  return modelIds?.length ? modelIds.map((id) => findModel(config, id)) : config.models;
}

function logRunHeader(providerName: string, config: AppConfig): void {
  const smells = resolveSmells(config.smells.enabled);
  console.log(`\n${"═".repeat(60)}`);
  console.log(`  Model:    ${providerName}`);
  console.log(`  Setup:    ${promptSetupTag(config.prompt)}`);
  console.log(`  Smells (${smells.length}): ${smells.map((s) => s.displayName).join(", ")}`);
  console.log(`${"═".repeat(60)}\n`);
}

/** Writes smell → run version → F1 for every evaluated run. */
function writeCrossModelSummary(config: AppConfig, versions: string[]): void {
  const outputDir = path.resolve(config.analyzer.outputDir);
  const summary: Record<string, Record<string, number>> = {};

  for (const version of versions) {
    const metricsPath = path.join(outputDir, `evaluation_metrics_v${version}.json`);
    if (!fs.existsSync(metricsPath)) {
      console.warn(`  Skipping ${version} — metrics file not found.`);
      continue;
    }
    const metrics: Array<{ smell: string; f1: number }> = JSON.parse(
      fs.readFileSync(metricsPath, "utf-8"),
    );
    const modelId = version.split("__")[0];
    for (const { smell, f1 } of metrics) {
      summary[smell] = { ...summary[smell], [modelId]: f1 };
    }
  }

  const summaryPath = path.join(outputDir, "cross_model_summary.json");
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
  console.log(`\n📊 Cross-model summary saved to ${summaryPath}`);
}
