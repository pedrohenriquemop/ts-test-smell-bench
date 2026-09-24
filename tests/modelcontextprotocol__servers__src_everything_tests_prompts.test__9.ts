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
    it('should reject invalid resource ID', () => {
          const { mockServer, handlers } = createMockServer();
          registerEmbeddedResourcePrompt(mockServer);

          const handler = handlers.get('resource-prompt')!;
          expect(() => handler({ resourceType: 'Text', resourceId: '-1' })).toThrow(
            'Invalid resourceId'
          );
          expect(() => handler({ resourceType: 'Text', resourceId: '0' })).toThrow(
            'Invalid resourceId'
          );
          expect(() => handler({ resourceType: 'Text', resourceId: 'abc' })).toThrow(
            'Invalid resourceId'
          );
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});