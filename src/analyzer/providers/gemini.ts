import axios from 'axios';
import type {
  ModelProvider,
  AnalysisRequest,
  AnalysisResponse,
} from '../provider.ts';

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
): { smells: string[]; justification: string } | null {
  const match = response.match(
    /FILE:.*?- SMELLS:\s*(.*?)\s*- JUSTIFICATION:\s*(.*)/si,
  );
  if (!match) return null;

  const smellsStr = match[1].trim();
  const justification = match[2].trim();

  let smells: string[] = [];
  if (
    smellsStr.toLowerCase() !== 'none' &&
    smellsStr !== '[]' &&
    smellsStr !== ''
  ) {
    smells = smellsStr.split(',').map((s) => s.trim());
  }

  return { smells, justification };
}

// ── Provider ─────────────────────────────────────────────────────────

export class GeminiProvider implements ModelProvider {
  readonly name: string;
  private readonly config: Required<GeminiProviderConfig>;

  constructor(cfg: GeminiProviderConfig) {
    if (!cfg.apiKey) {
      throw new Error('GeminiProvider requires an API key. Set apiKey in config or $GEMINI_API_KEY in .env');
    }

    this.config = {
      model: cfg.model,
      apiKey: cfg.apiKey,
      baseUrl: cfg.baseUrl ?? 'https://generativelanguage.googleapis.com',
      temperature: cfg.temperature ?? 0.0,
      maxTokens: cfg.maxTokens ?? 8192,
    };
    this.name = `Gemini / ${this.config.model}`;
  }

  async analyze(req: AnalysisRequest): Promise<AnalysisResponse> {
    const contextBlock =
      req.contextSnippets && req.contextSnippets.length > 0
        ? `\n    CONTEXT:\n${req.contextSnippets.map((s) => `    ${s}`).join('\n')}\n`
        : '';

    const userPrompt = `
    Analyze the following TypeScript test:
    
    AST METADATA:
    ${JSON.stringify(req.metadata, null, 2)}
    ${contextBlock}
    CODE:
    ${req.testCode}
    
    Respond only in the following format:
    FILE: [NAME] - SMELLS: [LIST] - JUSTIFICATION: [SHORT]
  `;

    const url = `${this.config.baseUrl}/v1beta/models/${this.config.model}:generateContent?key=${this.config.apiKey}`;

    const body = {
      contents: [
        {
          role: 'user',
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

    const response = await axios.post(url, body, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 120_000, // 2 min timeout for slow models
    });

    const latencyMs = Date.now() - start;

    // Extract text from Gemini response
    const candidates = response.data?.candidates ?? [];
    const rawText: string =
      candidates[0]?.content?.parts?.[0]?.text ?? '';

    // Extract token usage if available
    const usageMetadata = response.data?.usageMetadata;
    const tokenUsage = usageMetadata
      ? {
          prompt: usageMetadata.promptTokenCount ?? 0,
          completion: usageMetadata.candidatesTokenCount ?? 0,
        }
      : undefined;

    const parsed = parseModelResponse(rawText);

    return {
      rawText,
      smells: parsed?.smells ?? [],
      justification: parsed?.justification ?? '',
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
