import axios from "axios";
import {
  buildUserPrompt,
  type AnalysisRequest,
  type AnalysisResponse,
  type ModelProvider,
} from "../provider.ts";
import { parseModelResponse } from "../response-parser.ts";

const DEFAULT_BASE_URL = "https://generativelanguage.googleapis.com";
const REQUEST_TIMEOUT_MS = 120_000;

export interface GeminiProviderConfig {
  model: string;
  apiKey: string;
  baseUrl?: string;
  temperature?: number;
  maxTokens?: number;
}

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
      baseUrl: cfg.baseUrl ?? DEFAULT_BASE_URL,
      temperature: cfg.temperature ?? 0.0,
      maxTokens: cfg.maxTokens ?? 8192,
    };
    this.name = `Gemini / ${this.config.model}`;
  }

  async analyze(req: AnalysisRequest): Promise<AnalysisResponse> {
    const url = `${this.config.baseUrl}/v1beta/models/${this.config.model}:generateContent`;
    const body = {
      contents: [{ role: "user", parts: [{ text: buildUserPrompt(req) }] }],
      systemInstruction: { parts: [{ text: req.systemPrompt }] },
      generationConfig: {
        temperature: this.config.temperature,
        maxOutputTokens: this.config.maxTokens,
      },
    };

    const start = Date.now();
    let response;
    try {
      response = await axios.post(url, body, {
        headers: this.headers(),
        timeout: REQUEST_TIMEOUT_MS,
      });
    } catch (error) {
      if (!axios.isAxiosError(error)) throw error;
      const apiMessage = error.response?.data?.error?.message;
      throw new Error(
        `Gemini request failed for model "${this.config.model}" (HTTP ${
          error.response?.status ?? "network"
        })${apiMessage ? `: ${apiMessage}` : ""}`,
      );
    }
    const latencyMs = Date.now() - start;

    const rawText: string =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    const usage = response.data?.usageMetadata;
    const parsed = parseModelResponse(rawText, req.useChainOfThought ?? false);

    return {
      rawText,
      smells: parsed?.smells ?? [],
      justification: parsed?.justification ?? "",
      reasoningLog: parsed?.reasoningLog,
      modelName: this.name,
      latencyMs,
      tokenUsage: usage
        ? {
            prompt: usage.promptTokenCount ?? 0,
            completion: usage.candidatesTokenCount ?? 0,
          }
        : undefined,
    };
  }

  async healthCheck(): Promise<boolean> {
    try {
      const res = await axios.get(`${this.config.baseUrl}/v1beta/models`, {
        headers: this.headers(),
        timeout: 5000,
      });
      const models: Array<{ name: string }> = res.data?.models ?? [];
      return models.some((m) => m.name.includes(this.config.model));
    } catch {
      return false;
    }
  }

  private headers() {
    return {
      "Content-Type": "application/json",
      "x-goog-api-key": this.config.apiKey,
    };
  }
}
