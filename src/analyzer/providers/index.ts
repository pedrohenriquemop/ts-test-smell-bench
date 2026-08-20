/**
 * Provider factory — creates the right ModelProvider instance from a
 * ModelConfig entry in the config file.
 */

import type { ModelProvider } from '../provider.ts';
import type { ModelConfig } from '../../config/index.ts';
import { OllamaProvider } from './ollama.ts';
import { GeminiProvider } from './gemini.ts';

/**
 * Resolve an API key value.  If the value starts with "$", it's
 * treated as an environment variable name and looked up from
 * `process.env`.  Otherwise it's used as-is.
 */
function resolveApiKey(value: string | undefined): string {
  if (!value) return '';
  if (value.startsWith('$')) {
    const envVar = value.slice(1);
    const resolved = process.env[envVar];
    if (!resolved) {
      throw new Error(
        `API key env var "${envVar}" is not set. Add it to your .env file.`,
      );
    }
    return resolved;
  }
  return value;
}

export function createProvider(cfg: ModelConfig): ModelProvider {
  switch (cfg.provider) {
    case 'ollama':
      return new OllamaProvider({
        model: cfg.model,
        baseUrl: cfg.baseUrl,
        temperature: cfg.temperature,
      });

    case 'gemini':
      return new GeminiProvider({
        model: cfg.model,
        apiKey: resolveApiKey(cfg.apiKey),
        baseUrl: cfg.baseUrl,
        temperature: cfg.temperature,
        maxTokens: cfg.maxTokens,
      });

    case 'openai':
      // Not implemented — Ollama + Gemini cover current needs
      throw new Error(
        `Provider "openai" is not yet implemented. Model: ${cfg.id}`,
      );

    default:
      throw new Error(
        `Unknown provider "${(cfg as any).provider}" for model "${cfg.id}"`,
      );
  }
}

export { OllamaProvider } from './ollama.ts';
export { GeminiProvider } from './gemini.ts';
