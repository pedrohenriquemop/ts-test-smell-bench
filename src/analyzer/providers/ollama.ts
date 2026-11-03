import axios from "axios";
import {
  buildUserPrompt,
  type AnalysisRequest,
  type AnalysisResponse,
  type ModelProvider,
} from "../provider.ts";
import { parseModelResponse } from "../response-parser.ts";

const DEFAULT_GENERATE_URL = "http://localhost:11434/api/generate";
const REQUEST_TIMEOUT_MS = 480_000;

export interface OllamaProviderConfig {
  model: string;
  /** Full URL of the generate endpoint. */
  baseUrl?: string;
  temperature?: number;
  /** Sent as `num_predict`. */
  maxTokens?: number;
}

export class OllamaProvider implements ModelProvider {
  readonly name: string;
  private readonly config: Required<OllamaProviderConfig>;

  constructor(cfg: OllamaProviderConfig) {
    this.config = {
      model: cfg.model,
      baseUrl: cfg.baseUrl ?? DEFAULT_GENERATE_URL,
      temperature: cfg.temperature ?? 0.0,
      maxTokens: cfg.maxTokens ?? 2048,
    };
    this.name = `Ollama / ${this.config.model}`;
  }

  async analyze(req: AnalysisRequest): Promise<AnalysisResponse> {
    const start = Date.now();
    const response = await this.post({
      model: this.config.model,
      prompt: buildUserPrompt(req),
      system: req.systemPrompt,
      stream: false,
      options: {
        temperature: this.config.temperature,
        num_predict: this.config.maxTokens,
      },
    });
    const latencyMs = Date.now() - start;

    const rawText: string = response.data?.response ?? "";
    const parsed = parseModelResponse(rawText, req.useChainOfThought ?? false);

    return {
      rawText,
      smells: parsed?.smells ?? [],
      justification: parsed?.justification ?? "",
      reasoningLog: parsed?.reasoningLog,
      modelName: this.name,
      latencyMs,
    };
  }

  async healthCheck(): Promise<boolean> {
    try {
      const tagsUrl = this.config.baseUrl.replace(/\/api\/generate$/, "/api/tags");
      const res = await axios.get(tagsUrl, { timeout: 5000 });
      const models: Array<{ name: string }> = res.data?.models ?? [];
      return models.some((m) => m.name.startsWith(this.config.model));
    } catch {
      return false;
    }
  }

  /** An empty prompt makes Ollama load the model into memory without generating. */
  async warmUp(): Promise<void> {
    await this.post({ model: this.config.model, prompt: "", stream: false });
  }

  private async post(body: unknown) {
    try {
      return await axios.post(this.config.baseUrl, body, {
        timeout: REQUEST_TIMEOUT_MS,
      });
    } catch (error) {
      if (!axios.isAxiosError(error)) throw error;

      const { model, baseUrl } = this.config;
      const detail = error.response?.data?.error || error.message;
      if (error.response?.status === 404) {
        throw new Error(
          `Ollama request failed (HTTP 404): ${detail}. Run "ollama pull ${model}" or verify your baseUrl (${baseUrl}).`,
        );
      }
      if (error.code === "ECONNREFUSED") {
        throw new Error(
          `Could not connect to Ollama at ${baseUrl}. Please ensure the Ollama service is running.`,
        );
      }
      throw new Error(
        `Ollama request failed for model "${model}" (HTTP ${error.response?.status ?? error.code}): ${detail}`,
      );
    }
  }
}
