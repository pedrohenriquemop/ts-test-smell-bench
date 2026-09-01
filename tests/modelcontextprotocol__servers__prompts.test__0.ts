import { describe, it, expect, vi } from 'vitest';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerSimplePrompt } from '../prompts/simple.js';
import { registerArgumentsPrompt } from '../prompts/args.js';
import { registerPromptWithCompletions } from '../prompts/completions.js';
import { registerEmbeddedResourcePrompt } from '../prompts/resource.js';

function createMockServer() {
  const handlers: Map<string, Function> = new Map();
  const configs: Map<string, any> = new Map();

  const mockServer = {
    registerPrompt: vi.fn((name: string, config: any, handler: Function) => {
      handlers.set(name, handler);
      configs.set(name, config);
    }),
  } as unknown as McpServer;

  return { mockServer, handlers, configs };
}

describe('Prompts', () => {

  describe('simple-prompt', () => {

    // ── TARGET TEST ─────────────────────────────────
    it('should return fixed message with no arguments', () => {
          const { mockServer, handlers } = createMockServer();
          registerSimplePrompt(mockServer);

          const handler = handlers.get('simple-prompt')!;
          const result = handler();

          expect(result).toEqual({
            messages: [
              {
                role: 'user',
                content: {
                  type: 'text',
                  text: 'This is a simple prompt without arguments.',
                },
              },
            ],
          });
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});