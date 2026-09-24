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

  describe('resource-prompt', () => {

    // ── TARGET TEST ─────────────────────────────────
    it('should include both intro text and resource messages', () => {
          const { mockServer, handlers } = createMockServer();
          registerEmbeddedResourcePrompt(mockServer);

          const handler = handlers.get('resource-prompt')!;
          const result = handler({ resourceType: 'Text', resourceId: '3' });

          expect(result.messages).toHaveLength(2);
          expect(result.messages[0].role).toBe('user');
          expect(result.messages[0].content.type).toBe('text');
          expect(result.messages[1].role).toBe('user');
          expect(result.messages[1].content.type).toBe('resource');
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});