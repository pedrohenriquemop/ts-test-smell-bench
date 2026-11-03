export interface AnalysisRequest {
  fileName: string;
  /** Skeletal test file with the target test between TARGET TEST markers. */
  testCode: string;
  /** AST-extracted metrics (assertionCount, controlFlowCount, …). */
  metadata: Record<string, unknown>;
  systemPrompt: string;
  /** Imports, describe block and setup variables surrounding the test. */
  contextSnippets?: string[];
  useChainOfThought?: boolean;
  includeAstMetrics?: boolean;
}

export interface AnalysisResponse {
  rawText: string;
  smells: string[];
  justification: string;
  reasoningLog?: string;
  modelName: string;
  latencyMs: number;
  tokenUsage?: { prompt: number; completion: number };
}

export interface ModelProvider {
  readonly name: string;
  analyze(req: AnalysisRequest): Promise<AnalysisResponse>;
  /** Returns true when the backend is reachable and the model is available. */
  healthCheck?(): Promise<boolean>;
  /** Loads the model up front so its load time is not counted in the first test's latency. */
  warmUp?(): Promise<void>;
}

export function buildUserPrompt(req: AnalysisRequest): string {
  const includeAstMetrics = req.includeAstMetrics ?? true;

  const contextBlock = req.contextSnippets?.length
    ? `\nCONTEXT (IMPORTS & FIXTURES):\n${req.contextSnippets.map((s) => `  ${s}`).join("\n")}\n`
    : "";
  const astBlock = includeAstMetrics
    ? `AST METADATA:\n${JSON.stringify(req.metadata, null, 2)}\n`
    : "";
  const astInstruction = includeAstMetrics
    ? "Cross-reference the AST METADATA with the target test code to detect all applicable smells."
    : "Evaluate the target test source and supplied context only. No AST metadata is provided.";

  const classificationLine = `FILE: ${req.fileName} - SMELLS: [valid smell names separated by commas, or None] - JUSTIFICATION: [brief explanation]. Do not add brackets around the smell names. Use only names from the system prompt. Preserve labels and separators.`;
  const outputInstruction = req.useChainOfThought
    ? `Return exactly two blocks and nothing else. Put analysis only inside <thinking>. Inside <classification>, return one line exactly in this format, using the supplied filename "${req.fileName}": ${classificationLine}`
    : `Return exactly one line and nothing else, using the supplied filename "${req.fileName}": ${classificationLine}`;

  return `Analyze the following TypeScript test file for Test Smells.

CONTEXT & FILE STRUCTURE:
- File imports and ancestor describe() blocks provide fixture context for the test.
- The unit test to evaluate is located between "// ── TARGET TEST ──" and "// ── END TARGET TEST ──".
- ${astInstruction}

${astBlock}${contextBlock}
TEST SOURCE:
${req.testCode}

${outputInstruction}`;
}
