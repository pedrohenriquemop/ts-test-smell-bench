import * as fs from "fs";
import * as path from "path";
import {
  resultsSuffix,
  type AnalyzerConfig,
  type PromptConfig,
} from "../config/index.ts";
import {
  formatGoldsetLine,
  readGoldsetFile,
  type GoldsetEntry,
} from "../goldset/format.ts";
import type { AnalysisResponse, ModelProvider } from "./provider.ts";

export type PromptKind = "clean" | "next-batch" | "resume";
export type PromptHandler = (message: string, kind: PromptKind) => Promise<boolean>;

export interface RunAnalyzerOptions {
  config: AnalyzerConfig;
  provider: ModelProvider;
  systemPrompt: string;
  promptConfig: PromptConfig;
  /** Asks the user a yes/no question. Without it, every question is answered yes. */
  onPrompt?: PromptHandler;
}

interface ManifestEntry {
  file: string;
  metrics?: Record<string, unknown>;
  imports?: string[];
  describeContext?: string;
  setupVariables?: string[];
}

const GOLDSET_BATCH_SIZE = 50;
const MAX_RETRIES = 1;

function readManifest(manifestPath: string): ManifestEntry[] {
  return JSON.parse(fs.readFileSync(path.resolve(manifestPath), "utf-8"));
}

function buildContextSnippets(entry: ManifestEntry | undefined): string[] | undefined {
  if (!entry) return undefined;
  const snippets: string[] = [];
  if (entry.imports?.length) snippets.push(`IMPORTS:\n${entry.imports.join("\n")}`);
  if (entry.describeContext) snippets.push(`DESCRIBE BLOCK:\n${entry.describeContext}`);
  if (entry.setupVariables?.length) {
    snippets.push(`SETUP VARIABLES: ${entry.setupVariables.join(", ")}`);
  }
  return snippets.length > 0 ? snippets : undefined;
}

function analyzeEntry(
  options: RunAnalyzerOptions,
  entry: ManifestEntry | undefined,
  fileName: string,
  testCode: string,
): Promise<AnalysisResponse> {
  const { provider, systemPrompt, promptConfig } = options;
  return provider.analyze({
    fileName,
    testCode,
    metadata: promptConfig.includeAstMetrics ? (entry?.metrics ?? {}) : {},
    systemPrompt,
    useChainOfThought: promptConfig.useChainOfThought,
    includeAstMetrics: promptConfig.includeAstMetrics,
    contextSnippets: promptConfig.includeContext ? buildContextSnippets(entry) : undefined,
  });
}

async function ask(onPrompt: PromptHandler | undefined, message: string, kind: PromptKind) {
  return onPrompt ? onPrompt(message, kind) : true;
}

async function confirmRestart(onPrompt: PromptHandler | undefined, message: string) {
  if (!(await ask(onPrompt, message, "clean"))) {
    throw new Error("Aborted by user.");
  }
}

// ── Goldset generation ───────────────────────────────────────────────

function formatGoldset(entries: GoldsetEntry[], providerName: string, batchCount: number): string {
  const lines = [`[LLM="${providerName}"]`];
  for (let index = 0; index < entries.length; index += GOLDSET_BATCH_SIZE) {
    lines.push(`[Batch="${index / GOLDSET_BATCH_SIZE + 1}/${batchCount}"]`);
    lines.push(...entries.slice(index, index + GOLDSET_BATCH_SIZE).map(formatGoldsetLine));
  }
  return `${lines.join("\n")}\n`;
}

/** Returns the labels to keep from an existing goldset (only whole batches). */
async function resumableGoldsetEntries(
  goldsetPath: string,
  testsToLabel: ManifestEntry[],
  onPrompt: PromptHandler | undefined,
): Promise<GoldsetEntry[]> {
  if (!fs.existsSync(goldsetPath)) return [];

  const existing = readGoldsetFile(goldsetPath);
  const matchesCurrentTests = existing.every(
    (entry, index) => entry.file === testsToLabel[index]?.file,
  );
  if (!matchesCurrentTests) {
    await confirmRestart(onPrompt, "The existing goldset is for different tests. Delete it and start over?");
    return [];
  }

  const completedBatches = Math.floor(existing.length / GOLDSET_BATCH_SIZE);
  if (completedBatches === 0) {
    await confirmRestart(onPrompt, "Found an incomplete goldset. Delete it and start over?");
    return [];
  }

  const resume = await ask(
    onPrompt,
    `Found ${completedBatches} completed goldset batch(es). Resume from batch ${completedBatches + 1}?`,
    "resume",
  );
  if (resume) return existing.slice(0, completedBatches * GOLDSET_BATCH_SIZE);

  await confirmRestart(onPrompt, "Delete the existing goldset and start over?");
  return [];
}

/** Labels the first `numTests` manifest entries in batches and writes them as a goldset. */
export async function generateGoldset(options: RunAnalyzerOptions): Promise<void> {
  const { config, provider, onPrompt } = options;
  const testsDir = path.resolve(config.testsDir);
  const goldsetPath = path.resolve(config.referenceResultsPath);
  const testsToLabel = readManifest(config.manifestPath).slice(0, config.numTests);
  const totalBatches = Math.ceil(testsToLabel.length / GOLDSET_BATCH_SIZE);

  if (testsToLabel.length === 0) {
    console.log("No tests available to label.");
    return;
  }

  const entries = await resumableGoldsetEntries(goldsetPath, testsToLabel, onPrompt);
  if (entries.length >= testsToLabel.length) {
    console.log("Goldset already contains all requested tests.");
    return;
  }

  for (let batchStart = entries.length; batchStart < testsToLabel.length; batchStart += GOLDSET_BATCH_SIZE) {
    const batchNumber = batchStart / GOLDSET_BATCH_SIZE + 1;
    console.log(`\n=== Generating goldset batch ${batchNumber}/${totalBatches} ===`);

    for (const manifestEntry of testsToLabel.slice(batchStart, batchStart + GOLDSET_BATCH_SIZE)) {
      const testFilePath = path.join(testsDir, manifestEntry.file);
      if (!fs.existsSync(testFilePath)) {
        throw new Error(`Goldset test file not found: ${testFilePath}`);
      }

      console.log(`  Labeling ${manifestEntry.file}...`);
      const testCode = fs.readFileSync(testFilePath, "utf-8");
      const response = await analyzeEntry(options, manifestEntry, manifestEntry.file, testCode);
      entries.push({ file: manifestEntry.file, smells: response.smells });
    }

    fs.mkdirSync(path.dirname(goldsetPath), { recursive: true });
    fs.writeFileSync(goldsetPath, formatGoldset(entries, provider.name, totalBatches));
    console.log(`💾 Goldset batch ${batchNumber} saved to ${goldsetPath}`);

    const hasNextBatch = batchStart + GOLDSET_BATCH_SIZE < testsToLabel.length;
    if (hasNextBatch && onPrompt) {
      const proceed = await onPrompt(
        `Goldset batch ${batchNumber} finished. Generate the next batch?`,
        "next-batch",
      );
      if (!proceed) {
        console.log("Goldset generation stopped. You can resume from this batch later.");
        return;
      }
    }
  }

  console.log(`\n✅ Goldset generation complete: ${goldsetPath}`);
}

// ── Benchmark inference ──────────────────────────────────────────────

interface ComparisonRecord {
  file: string;
  modelStatus: string;
  error?: string;
  [field: string]: unknown;
}

/** Loads previous results up to the first errored record, which will be retried. */
async function resumableResults(
  outputPath: string,
  onPrompt: PromptHandler | undefined,
): Promise<ComparisonRecord[]> {
  if (!fs.existsSync(outputPath)) return [];

  let existing: ComparisonRecord[];
  try {
    existing = JSON.parse(fs.readFileSync(outputPath, "utf-8"));
  } catch (error) {
    if (!(error instanceof SyntaxError)) throw error;
    console.warn("Could not read existing results, starting fresh.", error);
    return [];
  }
  if (!Array.isArray(existing) || existing.length === 0) return [];

  const firstError = existing.findIndex((r) => r.modelStatus === "error" || r.error);
  const clean = firstError >= 0 ? existing.slice(0, firstError) : existing;
  if (clean.length < existing.length) {
    console.warn(`⚠️ Discarding ${existing.length - clean.length} errored/incomplete test records from previous run.`);
  }
  if (clean.length === 0) return [];

  const resume = await ask(
    onPrompt,
    `Found existing progress (${clean.length} test(s) completed). Resume where it stopped?`,
    "resume",
  );
  if (resume) return clean;

  await confirmRestart(onPrompt, "Delete previous progress and restart from the beginning?");
  fs.unlinkSync(outputPath);
  return [];
}

async function analyzeWithRetry(
  options: RunAnalyzerOptions,
  entry: ManifestEntry | undefined,
  fileName: string,
  testCode: string,
): Promise<AnalysisResponse> {
  for (let attempt = 0; ; attempt++) {
    try {
      return await analyzeEntry(options, entry, fileName, testCode);
    } catch (error) {
      if (attempt >= MAX_RETRIES) throw error;
      const backoffMs = (attempt + 1) * 1000;
      console.warn(`  ⚠️ Attempt ${attempt + 1} failed for ${fileName}. Retrying in ${backoffMs}ms...`);
      await new Promise((resolve) => setTimeout(resolve, backoffMs));
    }
  }
}

/**
 * Runs the model over every goldset test and records its prediction next to
 * the reference labels. Results are saved after each test so a crash or an
 * API failure can be resumed.
 */
export async function runAnalyzer(options: RunAnalyzerOptions): Promise<void> {
  const { config, provider, promptConfig, onPrompt } = options;
  const testsDir = path.resolve(config.testsDir);
  const outputDir = path.resolve(config.outputDir);
  const outputPath = path.join(outputDir, `comparison_results${resultsSuffix(config)}.json`);
  fs.mkdirSync(outputDir, { recursive: true });

  const results = await resumableResults(outputPath, onPrompt);
  const completedFiles = new Set(results.map((r) => r.file));

  console.log("Loading metadata...");
  const manifest = new Map(readManifest(config.manifestPath).map((entry) => [entry.file, entry]));

  console.log("Parsing reference results...");
  const reference = readGoldsetFile(path.resolve(config.referenceResultsPath)).slice(0, config.numTests);
  const pending = reference.filter((test) => !completedFiles.has(test.file));
  if (pending.length === 0) {
    console.log("No more tests to run.");
    return;
  }

  if (provider.healthCheck) {
    console.log(`Checking health of provider "${provider.name}"...`);
    if (!(await provider.healthCheck())) {
      throw new Error(
        `Health check failed for "${provider.name}". Please verify the model is pulled and the server is running.`,
      );
    }
  }

  const setup = `AST=${promptConfig.includeAstMetrics ? "ON" : "OFF"}, Context=${promptConfig.includeContext ? "ON" : "OFF"}`;
  console.log(`Starting analysis with "${provider.name}" for ${pending.length} remaining tests (${setup})...`);

  const save = () => fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
  const runInfo = {
    cotEnabled: promptConfig.useChainOfThought,
    astMetricsIncluded: promptConfig.includeAstMetrics,
  };

  for (const [index, { file: fileName, smells: referenceSmells }] of reference.entries()) {
    if (completedFiles.has(fileName)) continue;
    console.log(`\n[${index + 1}/${reference.length}] Processing ${fileName}...`);

    const testFilePath = path.join(testsDir, fileName);
    if (!fs.existsSync(testFilePath)) {
      console.warn(`Warning: Test file ${testFilePath} not found. Skipping.`);
      continue;
    }

    const manifestEntry = manifest.get(fileName);
    if (!manifestEntry?.metrics) {
      console.warn(`Warning: Metadata for ${fileName} not found. Running without AST metrics.`);
    }

    let response: AnalysisResponse;
    try {
      response = await analyzeWithRetry(options, manifestEntry, fileName, fs.readFileSync(testFilePath, "utf-8"));
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.error(`  ✖ Error running analysis for ${fileName}:`, errorMsg);
      // The errored record is discarded on resume, so this test is retried.
      results.push({
        file: fileName,
        referenceSmells,
        modelSmells: [],
        modelName: provider.name,
        modelStatus: "error",
        ...runInfo,
        error: errorMsg,
      });
      save();
      throw new Error(`Analysis failed for ${fileName}: ${errorMsg}. Progress saved to ${outputPath}.`);
    }

    const status = response.smells.length > 0 || response.justification ? "success" : "invalid return";
    results.push({
      file: fileName,
      referenceSmells,
      modelSmells: response.smells,
      modelName: response.modelName,
      modelStatus: status,
      ...runInfo,
      modelJustification: response.justification,
      reasoningLog: response.reasoningLog,
      latencyMs: response.latencyMs,
      rawModelResponse: response.rawText,
      tokenUsage: response.tokenUsage,
    });
    save();

    console.log(`  Reference Smells: ${referenceSmells.join(", ") || "None"}`);
    console.log(
      `  Model Smells:     ${status === "success" ? response.smells.join(", ") || "None" : "[Invalid Format]"}`,
    );
    console.log(`  Latency:          ${response.latencyMs}ms`);
  }

  console.log(`\n✅ Analysis complete. Final results saved to ${outputPath}`);
}
