import axios from "axios";
import type {
  ModelProvider,
  AnalysisRequest,
  AnalysisResponse,
} from "../provider.ts";

// ── Config ───────────────────────────────────────────────────────────

export interface OllamaProviderConfig {
  /** The Ollama model name (e.g. "detector-smells", "llama3:8b"). */
  model: string;

  /**
   * Full URL for the Ollama generate endpoint.
   * @default "http://localhost:11434/api/generate"
   */
  baseUrl?: string;

  /** Sampling temperature override (sent per-request). */
  temperature?: number;

  /** Max output tokens (num_predict in Ollama). @default 256 */
  maxTokens?: number;
}

// ── Response parser ──────────────────────────────────────────────────

/**
 * Parses the structured tail of an Ollama response.
 * Expected format:
 *   FILE: <name> - SMELLS: <comma-list> - JUSTIFICATION: <text>
 */
function parseOllamaResponse(
  response: string,
): { smells: string[]; justification: string } | null {
  const match = response.match(
    /FILE:.*?- SMELLS:\s*(.*?)\s*- JUSTIFICATION:\s*(.*)/is,
  );
  if (!match) return null;

  const smellsStr = match[1].trim();
  const justification = match[2].trim();

  let smells: string[] = [];
  if (
    smellsStr.toLowerCase() !== "none" &&
    smellsStr !== "[]" &&
    smellsStr !== ""
  ) {
    smells = smellsStr.split(",").map((s) => s.trim());
  }

  return { smells, justification };
}

// ── Provider ─────────────────────────────────────────────────────────

export class OllamaProvider implements ModelProvider {
  readonly name: string;
  private readonly config: Required<OllamaProviderConfig>;

  constructor(cfg: OllamaProviderConfig) {
    this.config = {
      model: cfg.model,
      baseUrl: cfg.baseUrl ?? "http://localhost:11434/api/generate",
      temperature: cfg.temperature ?? 0.0,
      maxTokens: cfg.maxTokens ?? 2048,
    };
    this.name = `Ollama / ${this.config.model}`;
  }

  async analyze(req: AnalysisRequest): Promise<AnalysisResponse> {
    const contextBlock =
      req.contextSnippets && req.contextSnippets.length > 0
        ? `\nCONTEXT (IMPORTS & FIXTURES):\n${req.contextSnippets.map((s) => `  ${s}`).join("\n")}\n`
        : "";

    const prompt = `Analyze the following TypeScript test file for Test Smells.

CONTEXT & FILE STRUCTURE:
- File imports and ancestor describe() blocks provide fixture context for the test.
- The unit test to evaluate is located between "// ── TARGET TEST ──" and "// ── END TARGET TEST ──".
- Cross-reference the AST METADATA with the target test code to detect all applicable smells.

AST METADATA:
${JSON.stringify(req.metadata, null, 2)}
${contextBlock}
TEST SOURCE:
${req.testCode}

Evaluate candidate smells against the target test and output:
FILE: [NAME] - SMELLS: [LIST or None] - JUSTIFICATION: [SHORT]`;

    const start = Date.now();

    let response;
    try {
      response = await axios.post(
        this.config.baseUrl,
        {
          model: this.config.model,
          prompt,
          system: req.systemPrompt,
          stream: false,
          options: {
            temperature: this.config.temperature,
            num_predict: this.config.maxTokens,
          },
        },
        { timeout: 360_000 },
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          const detail =
            error.response?.data?.error ||
            `model "${this.config.model}" not found or endpoint 404`;
          throw new Error(
            `Ollama request failed (HTTP 404): ${detail}. Run "ollama pull ${this.config.model}" or verify your baseUrl (${this.config.baseUrl}).`,
          );
        }
        if (error.code === "ECONNREFUSED") {
          throw new Error(
            `Could not connect to Ollama at ${this.config.baseUrl}. Please ensure the Ollama service is running.`,
          );
        }
        const detail = error.response?.data?.error || error.message;
        throw new Error(
          `Ollama request failed for model "${this.config.model}" (HTTP ${error.response?.status ?? error.code}): ${detail}`,
        );
      }
      throw error;
    }

    const latencyMs = Date.now() - start;
    const rawText: string = response.data?.response ?? "";
    const parsed = parseOllamaResponse(rawText);

    return {
      rawText,
      smells: parsed?.smells ?? [],
      justification: parsed?.justification ?? "",
      modelName: this.name,
      latencyMs,
      // Ollama doesn't reliably report token usage in the generate API
      tokenUsage: undefined,
    };
  }

  async healthCheck(): Promise<boolean> {
    try {
      // Ollama exposes a lightweight tags endpoint
      const tagsUrl = this.config.baseUrl.replace(
        /\/api\/generate$/,
        "/api/tags",
      );
      const res = await axios.get(tagsUrl, { timeout: 5000 });
      const models: Array<{ name: string }> = res.data?.models ?? [];
      return models.some((m) => m.name.startsWith(this.config.model));
    } catch {
      return false;
    }
  }
}
