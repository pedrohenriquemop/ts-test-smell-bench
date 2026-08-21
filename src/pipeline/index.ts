/**
 * Pipeline orchestrator — chains mine → prepare → analyze → evaluate
 * in a single automated flow.  Supports multi-model sequential runs
 * with per-model output versioning.
 */

import * as fs from 'fs';
import * as path from 'path';
import type { AppConfig, ModelConfig } from '../config/index.ts';
import { Miner } from '../miner/index.ts';
import { prepareLlmLabelingDataset } from '../dataset/index.ts';
import { runAnalyzer } from '../analyzer/index.ts';
import { createProvider } from '../analyzer/providers/index.ts';
import { resolveSmells } from '../smells/catalog.ts';
import { buildPromptForStrategy } from '../smells/prompt-builder.ts';
import { evaluateResults } from '../evaluator/index.ts';

// ── Types ────────────────────────────────────────────────────────────

export interface PipelineOptions {
  config: AppConfig;

  /** Which pipeline stages to execute. Defaults to all. */
  stages?: {
    mine?: boolean;
    prepare?: boolean;
    analyze?: boolean;
    evaluate?: boolean;
  };

  /**
   * Subset of model IDs to run.  If omitted, runs all models
   * defined in config.models[].
   */
  modelIds?: string[];

  /** Called at the start of each stage with stage name and model (if applicable). */
  onStageStart?: (stage: string, modelId?: string) => void;

  /** Called when a stage completes. */
  onStageComplete?: (stage: string, modelId?: string) => void;

  /** Called on stage error. Return `true` to continue, `false` to abort. */
  onStageError?: (stage: string, error: Error, modelId?: string) => boolean;
}

// ── Pipeline ─────────────────────────────────────────────────────────

export async function runPipeline(opts: PipelineOptions): Promise<void> {
  const { config, onStageStart, onStageComplete, onStageError } = opts;
  const stages = {
    mine: true,
    prepare: true,
    analyze: true,
    evaluate: true,
    ...opts.stages,
  };

  const notify = (stage: string, modelId?: string) => {
    onStageStart?.(stage, modelId);
  };
  const done = (stage: string, modelId?: string) => {
    onStageComplete?.(stage, modelId);
  };

  // ── 1. Mine ──────────────────────────────────────────────────
  if (stages.mine) {
    notify('mine');
    try {
      const miner = new Miner(config.miner);
      await miner.run();
      done('mine');
    } catch (err) {
      const cont = onStageError?.('mine', err as Error);
      if (!cont) throw err;
    }
  }

  // ── 2. Prepare ───────────────────────────────────────────────
  if (stages.prepare) {
    notify('prepare');
    try {
      prepareLlmLabelingDataset(
        config.dataset,
        config.miner.outputDir || 'tests',
      );
      done('prepare');
    } catch (err) {
      const cont = onStageError?.('prepare', err as Error);
      if (!cont) throw err;
    }
  }

  // ── 3. Analyze (per-model loop) ──────────────────────────────
  if (stages.analyze) {
    const models = resolveModels(config, opts.modelIds);
    const smellIds = config.smells?.enabled ?? [];
    const smells = resolveSmells(smellIds);
    const promptConfig = config.prompt;
    const systemPrompt = buildPromptForStrategy(smells, promptConfig);

    // Build ablation suffix for output file versioning
    const strategy = promptConfig?.strategy ?? 'standard';
    const astFlag = (promptConfig?.includeAstMetrics ?? true) ? 'ast' : 'noast';
    const ctxFlag = (promptConfig?.includeContext ?? true) ? 'ctx' : 'noctx';
    const setupSuffix = `${strategy}-${astFlag}-${ctxFlag}`;

    for (const modelCfg of models) {
      const modelTag = `${modelCfg.id}__${setupSuffix}`;
      notify('analyze', modelTag);

      try {
        const provider = createProvider(modelCfg);

        // Create a per-model copy of the analyzer config so each model
        // writes to its own output file (version suffix = model ID + setup).
        const analyzerCfg = {
          ...config.analyzer,
          version: modelTag,
        };

        console.log(`\n${'═'.repeat(60)}`);
        console.log(`  Model:    ${provider.name}`);
        console.log(`  Strategy: ${strategy}`);
        console.log(`  AST:      ${astFlag === 'ast' ? 'ON' : 'OFF'}`);
        console.log(`  Context:  ${ctxFlag === 'ctx' ? 'ON' : 'OFF'}`);
        console.log(`  Smells (${smells.length}): ${smells.map((s) => s.displayName).join(', ')}`);
        console.log(`  Tag:      ${modelTag}`);
        console.log(`${'═'.repeat(60)}\n`);

        await runAnalyzer({
          config: analyzerCfg,
          provider,
          systemPrompt,
          promptConfig,
        });

        done('analyze', modelTag);
      } catch (err) {
        const cont = onStageError?.('analyze', err as Error, modelTag);
        if (!cont) throw err;
      }
    }
  }

  // ── 4. Evaluate (per-model loop) ─────────────────────────────
  if (stages.evaluate) {
    const models = resolveModels(config, opts.modelIds);

    // Rebuild the same ablation suffix used in the analyze stage
    const promptConfig = config.prompt;
    const strategy = promptConfig?.strategy ?? 'standard';
    const astFlag = (promptConfig?.includeAstMetrics ?? true) ? 'ast' : 'noast';
    const ctxFlag = (promptConfig?.includeContext ?? true) ? 'ctx' : 'noctx';
    const setupSuffix = `${strategy}-${astFlag}-${ctxFlag}`;

    for (const modelCfg of models) {
      const modelTag = `${modelCfg.id}__${setupSuffix}`;
      notify('evaluate', modelTag);

      try {
        // Point the evaluator at the model-specific results file
        const evalConfig = {
          ...config,
          analyzer: {
            ...config.analyzer,
            version: modelTag,
          },
        };

        await evaluateResults(evalConfig);
        done('evaluate', modelTag);
      } catch (err) {
        const cont = onStageError?.('evaluate', err as Error, modelTag);
        if (!cont) throw err;
      }
    }

    // ── Cross-model summary ────────────────────────────────────
    if (models.length > 1) {
      generateCrossModelSummary(config, models, setupSuffix);
    }
  }

  console.log('\n✅ Pipeline complete.');
}

// ── Helpers ──────────────────────────────────────────────────────────

/**
 * Resolve which models to run: either a subset by ID or all configured.
 */
function resolveModels(config: AppConfig, modelIds?: string[]): ModelConfig[] {
  const allModels = config.models ?? [];
  if (allModels.length === 0) {
    throw new Error(
      'No models configured. Add a "models" array to your config file.',
    );
  }

  if (!modelIds || modelIds.length === 0) return allModels;

  return modelIds.map((id) => {
    const m = allModels.find((m) => m.id === id);
    if (!m) {
      const known = allModels.map((m) => m.id).join(', ');
      throw new Error(`Model "${id}" not found in config. Available: ${known}`);
    }
    return m;
  });
}

/**
 * After all models have been evaluated, generate a cross-model
 * comparison table (JSON) that side-by-side compares F1 scores.
 */
function generateCrossModelSummary(
  config: AppConfig,
  models: ModelConfig[],
  setupSuffix: string,
): void {
  const outputDir = path.resolve(process.cwd(), config.analyzer.outputDir);

  const summary: Record<string, Record<string, number>> = {};

  for (const modelCfg of models) {
    const modelTag = `${modelCfg.id}__${setupSuffix}`;
    const metricsPath = path.join(
      outputDir,
      `evaluation_metrics_v${modelTag}.json`,
    );

    if (!fs.existsSync(metricsPath)) {
      console.warn(`  Skipping ${modelCfg.id} — metrics file not found.`);
      continue;
    }

    const metrics: Array<{ smell: string; f1: number }> = JSON.parse(
      fs.readFileSync(metricsPath, 'utf-8'),
    );

    for (const m of metrics) {
      if (!summary[m.smell]) summary[m.smell] = {};
      summary[m.smell][modelCfg.id] = m.f1;
    }
  }

  const summaryPath = path.join(outputDir, 'cross_model_summary.json');
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
  console.log(`\n📊 Cross-model summary saved to ${summaryPath}`);
}
