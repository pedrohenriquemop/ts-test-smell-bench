import { describe, it, expect, vi } from 'vitest';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

function createMockServer() {
  return {
    registerTool: vi.fn(),
    registerPrompt: vi.fn(),
    registerResource: vi.fn(),
    server: {
      getClientCapabilities: vi.fn(() => ({})),
      setRequestHandler: vi.fn(),
    },
    sendLoggingMessage: vi.fn(),
    sendResourceUpdated: vi.fn(),
  } as unknown as McpServer;
}

describe('Registration Index Files', () => {

  describe('prompts/index.ts', () => {

    // ── TARGET TEST ─────────────────────────────────
    it('should register all prompts', async () => {
          const { registerPrompts } = await import('../prompts/index.js');
          const mockServer = createMockServer();

          registerPrompts(mockServer);

          // Should register 4 prompts
          expect(mockServer.registerPrompt).toHaveBeenCalledTimes(4);

          const registeredPrompts = (mockServer.registerPrompt as any).mock.calls.map(
            (call: any[]) => call[0]
          );
          expect(registeredPrompts).toContain('simple-prompt');
          expect(registeredPrompts).toContain('args-prompt');
          expect(registeredPrompts).toContain('completable-prompt');
          expect(registeredPrompts).toContain('resource-prompt');
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});