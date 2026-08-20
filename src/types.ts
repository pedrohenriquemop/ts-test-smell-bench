import type { MetricDescriptor } from "./metrics/metric.ts";

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
  /** When omitted, uses the built-in default metrics (lineCount, assertionCount). */
  metrics?: readonly MetricDescriptor<unknown>[];
}

export interface ExtractedTestCase {
  text: string;
  testName: string;
  metrics: Record<string, unknown>;

  // ── Context fields (Phase 3) ─────────────────────────────────────
  /**
   * The enclosing `describe()` block's setup code — beforeEach/beforeAll
   * hooks and top-level variable declarations — with other test bodies
   * stripped out.  Empty string if no enclosing describe exists.
   */
  describeContext: string;

  /**
   * All `import` declarations from the source file.
   * Helps the LLM identify Mystery Guest, Resource Optimism, and
   * dependency patterns.
   */
  imports: string[];

  /**
   * Names of variables declared or assigned in the nearest
   * beforeEach / beforeAll hooks.  Used to evaluate General Fixture
   * (how many of these does the test actually use?).
   */
  setupVariables: string[];
}
