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

  describe('args-prompt', () => {

    // ── TARGET TEST ─────────────────────────────────
    it('should handle city only (optional state omitted)', () => {
          const { mockServer, handlers } = createMockServer();
          registerArgumentsPrompt(mockServer);

          const handler = handlers.get('args-prompt')!;
          const result = handler({ city: 'New York' });

          expect(result.messages[0].content.text).toBe("What's weather in New York?");
          expect(result.messages[0].content.text).not.toContain(',');
          expect(result.messages[0].role).toBe('user');
          expect(result.messages[0].content.type).toBe('text');
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});