/**
 * Provider factory — creates the right ModelProvider instance from a
 * ModelConfig entry in the config file.
 */

import type { ModelProvider } from '../provider.ts';
import type { ModelConfig } from '../../config/index.ts';
import { OllamaProvider } from './ollama.ts';

export function createProvider(cfg: ModelConfig): ModelProvider {
  switch (cfg.provider) {
    case 'ollama':
      return new OllamaProvider({
        model: cfg.model,
        baseUrl: cfg.baseUrl,
        temperature: cfg.temperature,
      });

    case 'openai':
      // Will be implemented in Phase 5 (Task 1.3)
      throw new Error(
        `Provider "openai" is not yet implemented. Model: ${cfg.id}`,
      );

    case 'gemini':
      // Will be implemented in Phase 5 (Task 1.4)
      throw new Error(
        `Provider "gemini" is not yet implemented. Model: ${cfg.id}`,
      );

    default:
      throw new Error(
        `Unknown provider "${(cfg as any).provider}" for model "${cfg.id}"`,
      );
  }
}

export { OllamaProvider } from './ollama.ts';
