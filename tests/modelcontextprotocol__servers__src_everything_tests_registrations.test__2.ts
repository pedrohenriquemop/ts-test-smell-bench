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

  describe('tools/index.ts', () => {

    // ── TARGET TEST ─────────────────────────────────
    it('should not register conditional tools when capabilities missing', async () => {
          const { registerConditionalTools } = await import('../tools/index.js');

          const mockServerNoCapabilities = {
            registerTool: vi.fn(),
            server: {
              getClientCapabilities: vi.fn(() => ({})),
            },
            experimental: {
              tasks: {
                registerToolTask: vi.fn(),
              },
            },
          } as unknown as McpServer;

          registerConditionalTools(mockServerNoCapabilities);

          // Should not register any capability-gated tools when capabilities are missing
          expect(mockServerNoCapabilities.registerTool).not.toHaveBeenCalled();
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});