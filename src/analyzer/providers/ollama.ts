import axios from 'axios';
import type {
  ModelProvider,
  AnalysisRequest,
  AnalysisResponse,
} from '../provider.ts';

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

export class OllamaProvider implements ModelProvider {
  readonly name: string;
  private readonly config: Required<OllamaProviderConfig>;

  constructor(cfg: OllamaProviderConfig) {
    this.config = {
      model: cfg.model,
      baseUrl: cfg.baseUrl ?? 'http://localhost:11434/api/generate',
      temperature: cfg.temperature ?? 0.0,
    };
    this.name = `Ollama / ${this.config.model}`;
  }

  async analyze(req: AnalysisRequest): Promise<AnalysisResponse> {
    const contextBlock =
      req.contextSnippets && req.contextSnippets.length > 0
        ? `\n    CONTEXT:\n${req.contextSnippets.map((s) => `    ${s}`).join('\n')}\n`
        : '';

    const prompt = `
    Analyze the following TypeScript test:
    
    AST METADATA:
    ${JSON.stringify(req.metadata, null, 2)}
    ${contextBlock}
    CODE:
    ${req.testCode}
    
    Respond only in the following format:
    FILE: [NAME] - SMELLS: [LIST] - JUSTIFICATION: [SHORT]
  `;

    const start = Date.now();

    const response = await axios.post(this.config.baseUrl, {
      model: this.config.model,
      prompt,
      system: req.systemPrompt,
      stream: false,
      options: {
        temperature: this.config.temperature,
      },
    });

    const latencyMs = Date.now() - start;
    const rawText: string = response.data?.response ?? '';
    const parsed = parseOllamaResponse(rawText);

    return {
      rawText,
      smells: parsed?.smells ?? [],
      justification: parsed?.justification ?? '',
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
        '/api/tags',
      );
      const res = await axios.get(tagsUrl, { timeout: 5000 });
      const models: Array<{ name: string }> = res.data?.models ?? [];
      return models.some((m) => m.name.startsWith(this.config.model));
    } catch {
      return false;
    }
  }
}
