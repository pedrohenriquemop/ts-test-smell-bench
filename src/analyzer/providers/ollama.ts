import axios from "axios";
import type {
  ModelProvider,
  AnalysisRequest,
  AnalysisResponse,
} from "../provider.ts";
import { standardizeSmellList } from "../../smells/catalog.ts";

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
export function parseOllamaResponse(
  response: string,
  useChainOfThought = false,
): { smells: string[]; justification: string; reasoningLog?: string } | null {
  let reasoningLog: string | undefined;
  let targetText = response;

  if (useChainOfThought) {
    const cotMatch = response.match(
      /<classification\s*>([\s\S]*?)(?:<\/classification\s*>|$)/i,
    );
    reasoningLog = response
      .match(/<thinking\s*>([\s\S]*?)(?:<\/thinking\s*>|$)/i)?.[1]
      ?.trim();
    if (cotMatch && cotMatch[1].trim()) {
      targetText = cotMatch[1].trim();
    }
  }

  // 1. Try parsing JSON format
  const jsonText = targetText
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();
  try {
    const value = JSON.parse(jsonText);
    if (value && typeof value === "object") {
      const rawSmells = value.smells ?? value.SMELLS ?? [];
      const smells = standardizeSmellList(rawSmells);
      return {
        smells,
        justification: String(value.justification ?? value.JUSTIFICATION ?? ""),
        reasoningLog,
      };
    }
  } catch {
    // Legacy / line formats continue below
  }

  // 2. Try structured line regex on targetText, then full response as fallback
  const searchTexts =
    targetText !== response ? [targetText, response] : [targetText];

  for (const text of searchTexts) {
    // Format A: Standard with hyphen or newline before JUSTIFICATION
    const matchA = text.match(
      /FILE:.*?- SMELLS:\s*(.*?)\s*(?:[-–—\n]\s*JUSTIFICATION:|\s+JUSTIFICATION:)\s*(.*)/is,
    );
    if (matchA) {
      return {
        smells: standardizeSmellList(matchA[1]),
        justification: matchA[2].trim(),
        reasoningLog,
      };
    }

    // Format B: Case-insensitive Justification label
    const matchB = text.match(
      /FILE:.*?- SMELLS:\s*(.*?)(?:\s*[-–—]?\s*Justification:)\s*(.*)/is,
    );
    if (matchB) {
      return {
        smells: standardizeSmellList(matchB[1]),
        justification: matchB[2].trim(),
        reasoningLog,
      };
    }

    // Format C: SMELLS: ... - <sentence explanation>
    const matchC = text.match(
      /FILE:.*?- SMELLS:\s*([^-\n]+?)\s*[-–—]\s*(.*)/is,
    );
    if (matchC) {
      return {
        smells: standardizeSmellList(matchC[1]),
        justification: matchC[2].trim(),
        reasoningLog,
      };
    }

    // Format D: Standalone SMELLS line
    const matchD = text.match(/FILE:.*?- SMELLS:\s*(.*)/is);
    if (matchD) {
      return {
        smells: standardizeSmellList(matchD[1]),
        justification: "",
        reasoningLog,
      };
    }
  }

  // 3. Fallback for model conclusion statements
  const matchConclusion = response.match(
    /only applicable smell is\s*\*\*?([^*]+)\*\*?/i,
  );
  if (matchConclusion) {
    return {
      smells: standardizeSmellList(matchConclusion[1]),
      justification: "Extracted from model concluding statement",
      reasoningLog,
    };
  }

  return null;
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

    const includeAstMetrics = req.includeAstMetrics ?? true;
    const astBlock = includeAstMetrics
      ? `AST METADATA:\n${JSON.stringify(req.metadata, null, 2)}\n`
      : "";
    const astInstruction = includeAstMetrics
      ? "Cross-reference the AST METADATA with the target test code to detect all applicable smells."
      : "Evaluate the target test source and supplied context only. No AST metadata is provided.";
    const outputInstruction = req.useChainOfThought
      ? `Return exactly two blocks and nothing else. Put analysis only inside <thinking>. Inside <classification>, return one line exactly in this format, using the supplied filename "${req.fileName}": FILE: ${req.fileName} - SMELLS: [valid smell names separated by commas, or None] - JUSTIFICATION: [brief explanation]. Do not add brackets around the smell names. Use only names from the system prompt. Preserve labels and separators.`
      : `Return exactly one line and nothing else, using the supplied filename "${req.fileName}": FILE: ${req.fileName} - SMELLS: [valid smell names separated by commas, or None] - JUSTIFICATION: [brief explanation]. Do not add brackets around the smell names. Use only names from the system prompt. Preserve labels and separators.`;
    const prompt = `Analyze the following TypeScript test file for Test Smells.

CONTEXT & FILE STRUCTURE:
- File imports and ancestor describe() blocks provide fixture context for the test.
- The unit test to evaluate is located between "// ── TARGET TEST ──" and "// ── END TARGET TEST ──".
- ${astInstruction}

${astBlock}${contextBlock}
TEST SOURCE:
${req.testCode}

${outputInstruction}`;

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
        { timeout: 480_000 },
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
    const parsed = parseOllamaResponse(rawText, req.useChainOfThought ?? false);

    return {
      rawText,
      smells: parsed?.smells ?? [],
      justification: parsed?.justification ?? "",
      reasoningLog: parsed?.reasoningLog,
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
