import type { ModelProvider } from "../provider.ts";
import type { ModelConfig } from "../../config/index.ts";
import { OllamaProvider } from "./ollama.ts";
import { GeminiProvider } from "./gemini.ts";

/** A value starting with "$" names an environment variable holding the key. */
function resolveApiKey(value: string | undefined): string {
  if (!value?.startsWith("$")) return value ?? "";

  const envVar = value.slice(1);
  const resolved = process.env[envVar];
  if (!resolved) {
    throw new Error(
      `API key env var "${envVar}" is not set. Add it to your .env file.`,
    );
  }
  return resolved;
}

export function createProvider(cfg: ModelConfig): ModelProvider {
  switch (cfg.provider) {
    case "ollama":
      return new OllamaProvider({
        model: cfg.model,
        baseUrl: cfg.baseUrl,
        temperature: cfg.temperature,
        maxTokens: cfg.maxTokens,
      });
    case "gemini":
      return new GeminiProvider({
        model: cfg.model,
        apiKey: resolveApiKey(cfg.apiKey),
        baseUrl: cfg.baseUrl,
        temperature: cfg.temperature,
        maxTokens: cfg.maxTokens,
      });
    default:
      throw new Error(
        `Unknown provider "${(cfg as { provider: string }).provider}" for model "${cfg.id}"`,
      );
  }
}
