import axios from "axios";
import type {
  ModelProvider,
  AnalysisRequest,
  AnalysisResponse,
} from "../provider.ts";
import { standardizeSmellList } from "../../smells/catalog.ts";

// ── Config ───────────────────────────────────────────────────────────

export interface GeminiProviderConfig {
  /** The Gemini model name (e.g. "gemini-2.5-flash-preview-04-17"). */
  model: string;

  /**
   * API key for Google AI Studio.
   * Get one at https://aistudio.google.com/apikey
   */
  apiKey: string;

  /**
   * Base URL for the Gemini API.
   * @default "https://generativelanguage.googleapis.com"
   */
  baseUrl?: string;

  /** Sampling temperature override. */
  temperature?: number;

  /** Max output tokens. */
  maxTokens?: number;
}

// ── Response parser ──────────────────────────────────────────────────

/**
 * Parses the structured tail of a Gemini response.
 * Expected format (same as Ollama):
 *   FILE: <name> - SMELLS: <comma-list> - JUSTIFICATION: <text>
 */
function parseModelResponse(
  response: string,
  useChainOfThought = false,
): { smells: string[]; justification: string } | null {
  let targetText = response;

  if (useChainOfThought) {
    const classification = response.match(
      /<classification\s*>([\s\S]*?)(?:<\/classification\s*>|$)/i,
    );
    if (classification && classification[1].trim()) {
      targetText = classification[1].trim();
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
      };
    }

    // Format D: Standalone SMELLS line
    const matchD = text.match(/FILE:.*?- SMELLS:\s*(.*)/is);
    if (matchD) {
      return {
        smells: standardizeSmellList(matchD[1]),
        justification: "",
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
    };
  }

  return null;
}

// ── Provider ─────────────────────────────────────────────────────────

export class GeminiProvider implements ModelProvider {
  readonly name: string;
  private readonly config: Required<GeminiProviderConfig>;

  constructor(cfg: GeminiProviderConfig) {
    if (!cfg.apiKey) {
      throw new Error(
        "GeminiProvider requires an API key. Set apiKey in config or $GEMINI_API_KEY in .env",
      );
    }

    this.config = {
      model: cfg.model,
      apiKey: cfg.apiKey,
      baseUrl: cfg.baseUrl ?? "https://generativelanguage.googleapis.com",
      temperature: cfg.temperature ?? 0.0,
      maxTokens: cfg.maxTokens ?? 8192,
    };
    this.name = `Gemini / ${this.config.model}`;
  }

  async analyze(req: AnalysisRequest): Promise<AnalysisResponse> {
    const contextBlock =
      req.contextSnippets && req.contextSnippets.length > 0
        ? `\n    CONTEXT:\n${req.contextSnippets.map((s) => `    ${s}`).join("\n")}\n`
        : "";

    const outputInstruction = req.useChainOfThought
      ? `Return exactly two blocks and nothing else. Put analysis only inside <thinking>. Inside <classification>, return one line exactly in this format, using the supplied filename "${req.fileName}": FILE: ${req.fileName} - SMELLS: [valid smell names separated by commas, or None] - JUSTIFICATION: [brief explanation]. Do not add brackets around the smell names. Use only names from the system prompt. Preserve labels and separators.`
      : `Return exactly one line and nothing else, using the supplied filename "${req.fileName}": FILE: ${req.fileName} - SMELLS: [valid smell names separated by commas, or None] - JUSTIFICATION: [brief explanation]. Do not add brackets around the smell names. Use only names from the system prompt. Preserve labels and separators.`;
    const userPrompt = `
    Analyze the following TypeScript test:
    
    AST METADATA:
    ${JSON.stringify(req.metadata, null, 2)}
    ${contextBlock}
    CODE:
    ${req.testCode}
    
    ${outputInstruction}
  `;

    const url = `${this.config.baseUrl}/v1beta/models/${this.config.model}:generateContent?key=${this.config.apiKey}`;

    const body = {
      contents: [
        {
          role: "user",
          parts: [{ text: userPrompt }],
        },
      ],
      systemInstruction: {
        parts: [{ text: req.systemPrompt }],
      },
      generationConfig: {
        temperature: this.config.temperature,
        maxOutputTokens: this.config.maxTokens,
      },
    };

    const start = Date.now();

    let response;
    try {
      response = await axios.post(url, body, {
        headers: { "Content-Type": "application/json" },
        timeout: 120_000, // 2 min timeout for slow models
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const apiMessage = error.response?.data?.error?.message;
        const detail = apiMessage ? `: ${apiMessage}` : "";
        throw new Error(
          `Gemini request failed for model "${this.config.model}" (HTTP ${
            error.response?.status ?? "network"
          })${detail}`
        );
      }
      throw error;
    }

    const latencyMs = Date.now() - start;

    // Extract text from Gemini response
    const candidates = response.data?.candidates ?? [];
    const rawText: string = candidates[0]?.content?.parts?.[0]?.text ?? "";

    // Extract token usage if available
    const usageMetadata = response.data?.usageMetadata;
    const tokenUsage = usageMetadata
      ? {
          prompt: usageMetadata.promptTokenCount ?? 0,
          completion: usageMetadata.candidatesTokenCount ?? 0,
        }
      : undefined;

    const parsed = parseModelResponse(rawText, req.useChainOfThought ?? false);

    return {
      rawText,
      smells: parsed?.smells ?? [],
      justification: parsed?.justification ?? "",
      modelName: this.name,
      latencyMs,
      tokenUsage,
    };
  }

  async healthCheck(): Promise<boolean> {
    try {
      // List models to verify the API key works
      const url = `${this.config.baseUrl}/v1beta/models?key=${this.config.apiKey}`;
      const res = await axios.get(url, { timeout: 5000 });
      const models: Array<{ name: string }> = res.data?.models ?? [];
      return models.some((m) => m.name.includes(this.config.model));
    } catch {
      return false;
    }
  }
}
