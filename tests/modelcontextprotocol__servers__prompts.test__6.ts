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
    it('should return text resource reference', () => {
          const { mockServer, handlers } = createMockServer();
          registerEmbeddedResourcePrompt(mockServer);

          const handler = handlers.get('resource-prompt')!;
          const result = handler({ resourceType: 'Text', resourceId: '1' });

          expect(result.messages).toHaveLength(2);
          expect(result.messages[0].content.text).toContain('Text');
          expect(result.messages[0].content.text).toContain('1');
          expect(result.messages[1].content.type).toBe('resource');
          expect(result.messages[1].content.resource.uri).toContain('text/1');
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});