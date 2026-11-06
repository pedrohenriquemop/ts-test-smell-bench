import {
  findModel,
  promptSetupTag,
  type AnalyzerConfig,
  type AppConfig,
  type ModelConfig,
  type PromptConfig,
  type PromptVariant,
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
import { writeCrossModelReport } from "../evaluator/cross-model.ts";
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

/** One local-model evaluation: the model and the prompt variant it is run with. */
export interface EvaluationRun extends PromptVariant {
  modelId: string;
}

export interface PipelineOptions {
  config: AppConfig;
  stages?: Partial<PipelineStages>;
  /** Model IDs to run; defaults to every configured model. */
  modelIds?: string[];
  /**
   * Runs for the evaluate, sanitize and metrics stages. Defaults to each
   * selected local model with the prompt flags from the config.
   */
  evaluationRuns?: EvaluationRun[];
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

  const systemPrompt = (prompt: PromptConfig) =>
    buildSystemPrompt(resolveSmells(config.smells.enabled), prompt);
  const runs = () => resolveEvaluationRuns(config, opts);

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
        logRunHeader(provider.name, config.prompt, config);
        return generateGoldset({
          config: config.analyzer,
          provider,
          systemPrompt: systemPrompt(config.prompt),
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
    for (const run of runs()) {
      await runStage(
        "evaluate",
        () => {
          const provider = createProvider(run.model);
          logRunHeader(provider.name, run.prompt, config);
          return runAnalyzer({
            config: run.analyzer,
            provider,
            systemPrompt: systemPrompt(run.prompt),
            promptConfig: run.prompt,
            onPrompt: opts.onPrompt,
          });
        },
        run.version,
      );
    }
  }

  if (stages.sanitize) {
    for (const run of runs()) {
      await runStage("sanitize", () => sanitizeComparisonResults(run.analyzer), run.version);
    }
  }

  if (stages.generateMetrics) {
    const metricRuns = runs();
    for (const run of metricRuns) {
      await runStage("generateMetrics", () => evaluateResults(run.analyzer), run.version);
    }
    if (metricRuns.length > 1) {
      writeCrossModelReport(config.analyzer, metricRuns.map((run) => run.version));
    }
  }

  console.log("\n✅ Pipeline complete.");
}

function selectModels(config: AppConfig, modelIds?: string[]): ModelConfig[] {
  if (config.models.length === 0) {
    throw new Error('No models configured. Add a "models" array to your config file.');
  }
  return modelIds?.length ? modelIds.map((id) => findModel(config, id)) : config.models;
}

interface ResolvedRun {
  model: ModelConfig;
  prompt: PromptConfig;
  /** Result-file tag, e.g. "llama3.1-8b__standard-noast-ctx". */
  version: string;
  analyzer: AnalyzerConfig;
}

/** Ordered by model so Ollama loads each model once for all of its variants. */
function resolveEvaluationRuns(config: AppConfig, opts: PipelineOptions): ResolvedRun[] {
  const requested: EvaluationRun[] =
    opts.evaluationRuns ??
    selectModels(config, opts.modelIds)
      .filter((m) => m.provider === "ollama")
      .map((m) => ({
        modelId: m.id,
        useChainOfThought: config.prompt.useChainOfThought,
        includeAstMetrics: config.prompt.includeAstMetrics,
      }));

  const modelOrder = (id: string) => config.models.findIndex((m) => m.id === id);
  return [...requested]
    .sort((a, b) => modelOrder(a.modelId) - modelOrder(b.modelId))
    .map((run) => {
      const prompt = {
        ...config.prompt,
        useChainOfThought: run.useChainOfThought,
        includeAstMetrics: run.includeAstMetrics,
      };
      const version = `${run.modelId}__${promptSetupTag(prompt)}`;
      return { model: findModel(config, run.modelId), prompt, version, analyzer: { ...config.analyzer, version } };
    });
}

function logRunHeader(providerName: string, prompt: PromptConfig, config: AppConfig): void {
  const smells = resolveSmells(config.smells.enabled);
  console.log(`\n${"═".repeat(60)}`);
  console.log(`  Model:    ${providerName}`);
  console.log(`  Setup:    ${promptSetupTag(prompt)}`);
  console.log(`  Smells (${smells.length}): ${smells.map((s) => s.displayName).join(", ")}`);
  console.log(`${"═".repeat(60)}\n`);
}
