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

  describe('completable-prompt', () => {

    // ── TARGET TEST ─────────────────────────────────
    it('should work with different departments', () => {
          const { mockServer, handlers } = createMockServer();
          registerPromptWithCompletions(mockServer);

          const handler = handlers.get('completable-prompt')!;

          const salesResult = handler({ department: 'Sales', name: 'David' });
          expect(salesResult.messages[0].content.text).toContain('Sales');
          expect(salesResult.messages[0].content.text).toContain('David');
          expect(salesResult.messages[0].role).toBe('user');

          const marketingResult = handler({ department: 'Marketing', name: 'Grace' });
          expect(marketingResult.messages[0].content.text).toContain('Marketing');
          expect(marketingResult.messages[0].content.text).toContain('Grace');
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});