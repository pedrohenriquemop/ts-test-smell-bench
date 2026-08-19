import * as fs from 'fs';
import * as path from 'path';

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
  /** Unique identifier used in CLI and output file names (e.g. "llama3-local"). */
  id: string;
  /** Backend provider type. */
  provider: 'ollama' | 'openai' | 'gemini';
  /** Model name understood by the provider API. */
  model: string;
  /** Override the provider's default endpoint URL. */
  baseUrl?: string;
  /**
   * API key — either a literal value or an env-var reference
   * prefixed with "$" (e.g. "$OPENAI_API_KEY").
   */
  apiKey?: string;
  /** Sampling temperature override. */
  temperature?: number;
  /** Max tokens / max output length override. */
  maxTokens?: number;
  /** Path to a file containing a custom system prompt for this model. */
  systemPromptFile?: string;
}

export interface AnalyzerConfig {
  /** @deprecated Use the top-level `models` array instead. */
  model?: string;
  /** @deprecated Use the top-level `models` array instead. */
  ollamaUrl?: string;
  numTests: number;
  manifestPath: string;
  testsDir: string;
  /** Path to the reference/gold-standard results file. */
  referenceResultsPath: string;
  outputDir: string;
  version?: string;
}

export interface SmellsConfig {
  /** List of smell IDs to detect (from the smell catalog). */
  enabled: string[];
}

export interface AppConfig {
  miner: MinerConfig;
  dataset: DatasetConfig;
  analyzer: AnalyzerConfig;
  /** Configured model backends (multi-model support). */
  models?: ModelConfig[];
  /** Which smells to detect. Defaults to all if omitted. */
  smells?: SmellsConfig;
}

export async function loadConfig(configPath: string = 'ts-test-smell-bench.config.json'): Promise<AppConfig> {
  const fullPath = path.resolve(process.cwd(), configPath);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Configuration file not found at ${fullPath}`);
  }
  const content = fs.readFileSync(fullPath, 'utf-8');
  const raw = JSON.parse(content);

  // ── Backward-compatibility shims ──────────────────────────────
  // Rename old `geminiResultsPath` → `referenceResultsPath`
  if (raw.analyzer?.geminiResultsPath && !raw.analyzer?.referenceResultsPath) {
    raw.analyzer.referenceResultsPath = raw.analyzer.geminiResultsPath;
    delete raw.analyzer.geminiResultsPath;
  }

  // If no top-level `models` array exists, synthesize one from the
  // legacy `analyzer.model` + `analyzer.ollamaUrl` fields.
  if (!raw.models && raw.analyzer?.model) {
    raw.models = [
      {
        id: raw.analyzer.model,
        provider: 'ollama' as const,
        model: raw.analyzer.model,
        baseUrl: raw.analyzer.ollamaUrl ?? 'http://localhost:11434/api/generate',
      },
    ];
  }

  // Default smells to the full catalog when not specified.
  // Import is dynamic to avoid circular deps at module-load time.
  if (!raw.smells) {
    const { allSmellIds } = await import('../smells/catalog.ts');
    raw.smells = { enabled: allSmellIds() };
  }

  return raw as AppConfig;
}
