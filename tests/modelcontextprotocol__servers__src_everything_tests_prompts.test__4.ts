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
    it('should generate promotion message with department and name', () => {
          const { mockServer, handlers } = createMockServer();
          registerPromptWithCompletions(mockServer);

          const handler = handlers.get('completable-prompt')!;
          const result = handler({ department: 'Engineering', name: 'Alice' });

          expect(result.messages[0].content.text).toBe(
            'Please promote Alice to the head of the Engineering team.'
          );
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});