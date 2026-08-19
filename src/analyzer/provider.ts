/**
 * Defines the contract every model backend must implement, along with
 * the request / response shapes exchanged between the analyzer and the
 * underlying LLM provider.
 */

// ── Request ──────────────────────────────────────────────────────────

export interface AnalysisRequest {
  /** The isolated `it()` / `test()` block source code. */
  testCode: string;

  /** AST-extracted metrics (assertionCount, controlFlowCount, …). */
  metadata: Record<string, unknown>;

  /** The system prompt describing the smell-detection rules. */
  systemPrompt: string;

  /**
   * Optional extra context snippets that help the LLM evaluate smells
   * requiring broader visibility (e.g. enclosing describe/beforeEach,
   * import statements, SUT code).
   */
  contextSnippets?: string[];
}

// ── Response ─────────────────────────────────────────────────────────

export interface AnalysisResponse {
  /** The full raw text returned by the model. */
  rawText: string;

  /** Parsed list of detected smell display-names. */
  smells: string[];

  /** Short justification extracted from the model output. */
  justification: string;

  /** Human-readable model identifier (e.g. "llama3:8b via Ollama"). */
  modelName: string;

  /** Wall-clock latency for this single request, in milliseconds. */
  latencyMs: number;

  /** Token usage reported by the provider, when available. */
  tokenUsage?: { prompt: number; completion: number };
}

// ── Provider interface ───────────────────────────────────────────────

export interface ModelProvider {
  /** A stable human-readable name shown in reports (e.g. "Ollama / llama3:8b"). */
  readonly name: string;

  /** Send a single test analysis request and return the parsed result. */
  analyze(req: AnalysisRequest): Promise<AnalysisResponse>;

  /**
   * Optional connectivity / availability check.
   * Returns `true` when the provider is reachable and the requested model
   * is available.
   */
  healthCheck?(): Promise<boolean>;
}
