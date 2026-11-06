import * as fs from "fs";
import * as path from "path";
import { allSmellIds } from "../smells/catalog.ts";

export const DEFAULT_CONFIG_PATH = "ts-test-smell-bench.config.json";

export interface MinerConfig {
  minStars: number;
  language: string;
  maxRepos: number;
  maxFilesPerRepo: number;
  globalFileLimit: number;
  cooldownMs: number;
  outputDir: string;
  heuristics: {
    minLines: number;
    minAssertions: number;
  };
}

export interface DatasetConfig {
  sampleSize: number;
  outputDir: string;
  manifestPath: string;
}

export interface ModelConfig {
  /** Identifier used in the CLI and in output file names. */
  id: string;
  provider: "ollama" | "gemini";
  /** Model name understood by the provider API. */
  model: string;
  baseUrl?: string;
  /** Literal key, or an env-var reference prefixed with "$". */
  apiKey?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface AnalyzerConfig {
  numTests: number;
  manifestPath: string;
  testsDir: string;
  /** Goldset file the model predictions are compared against. */
  referenceResultsPath: string;
  outputDir: string;
  /** Suffix appended to result file names (e.g. "llama3.1-8b__chain-of-thought-ast-ctx"). */
  version?: string;
}

export interface PromptConfig {
  useChainOfThought: boolean;
  includeAstMetrics: boolean;
  /** Imports, describe block and setup variables. */
  includeContext: boolean;
}

export interface AppConfig {
  miner: MinerConfig;
  dataset: DatasetConfig;
  analyzer: AnalyzerConfig;
  models: ModelConfig[];
  smells: { enabled: string[] };
  prompt: PromptConfig;
}

export async function loadConfig(
  configPath: string = DEFAULT_CONFIG_PATH,
): Promise<AppConfig> {
  const fullPath = path.resolve(process.cwd(), configPath);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Configuration file not found at ${fullPath}`);
  }
  const raw = JSON.parse(fs.readFileSync(fullPath, "utf-8"));

  return {
    ...raw,
    models: raw.models ?? [],
    smells: raw.smells ?? { enabled: allSmellIds() },
    prompt: resolvePromptConfig(raw.prompt ?? {}),
  };
}

/**
 * `strategy` is accepted as an alias of `useChainOfThought`. Both feed the
 * run tag, so a mismatch would label a CoT run as "standard" (or vice versa).
 */
function resolvePromptConfig(raw: {
  useChainOfThought?: boolean;
  strategy?: "standard" | "chain-of-thought";
  includeAstMetrics?: boolean;
  includeContext?: boolean;
}): PromptConfig {
  const fromStrategy =
    raw.strategy === undefined ? undefined : raw.strategy === "chain-of-thought";
  if (
    raw.useChainOfThought !== undefined &&
    fromStrategy !== undefined &&
    raw.useChainOfThought !== fromStrategy
  ) {
    throw new Error(
      `Conflicting prompt config: useChainOfThought=${raw.useChainOfThought} but strategy="${raw.strategy}".`,
    );
  }

  return {
    useChainOfThought: raw.useChainOfThought ?? fromStrategy ?? true,
    includeAstMetrics: raw.includeAstMetrics ?? true,
    includeContext: raw.includeContext ?? true,
  };
}

/** The prompt flags that can vary between evaluation runs of the same model. */
export type PromptVariant = Pick<PromptConfig, "useChainOfThought" | "includeAstMetrics">;

export const PROMPT_VARIANTS: PromptVariant[] = [
  { useChainOfThought: true, includeAstMetrics: true },
  { useChainOfThought: false, includeAstMetrics: true },
  { useChainOfThought: true, includeAstMetrics: false },
  { useChainOfThought: false, includeAstMetrics: false },
];

/** Run tag used to version result files, e.g. "chain-of-thought-ast-ctx". */
export function promptSetupTag(prompt: PromptConfig): string {
  return [
    prompt.useChainOfThought ? "chain-of-thought" : "standard",
    prompt.includeAstMetrics ? "ast" : "noast",
    prompt.includeContext ? "ctx" : "noctx",
  ].join("-");
}

export function findModel(config: AppConfig, id: string): ModelConfig {
  const model = config.models.find((m) => m.id === id);
  if (!model) {
    const known = config.models.map((m) => m.id).join(", ");
    throw new Error(`Model "${id}" not found in config. Available: ${known}`);
  }
  return model;
}

export function resultsSuffix(analyzer: AnalyzerConfig): string {
  return analyzer.version ? `_v${analyzer.version}` : "";
}
