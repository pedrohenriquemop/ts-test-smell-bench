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
    it('should register conditional tools based on capabilities', async () => {
          const { registerConditionalTools } = await import('../tools/index.js');

          // Server with all capabilities including experimental tasks API
          const mockServerWithCapabilities = {
            registerTool: vi.fn(),
            server: {
              getClientCapabilities: vi.fn(() => ({
                roots: {},
                elicitation: { url: {} },
                sampling: {},
              })),
            },
            experimental: {
              tasks: {
                registerToolTask: vi.fn(),
              },
            },
          } as unknown as McpServer;

          registerConditionalTools(mockServerWithCapabilities);

          // Should register 4 conditional tools via registerTool when all capabilities
          // are present. Task-based tools register via registerToolTask (counted separately),
          // so they are not included in this registerTool count.
          expect(mockServerWithCapabilities.registerTool).toHaveBeenCalledTimes(4);

          const registeredTools = (
            mockServerWithCapabilities.registerTool as any
          ).mock.calls.map((call: any[]) => call[0]);
          expect(registeredTools).toContain('get-roots-list');
          expect(registeredTools).toContain('trigger-elicitation-request');
          expect(registeredTools).toContain('trigger-url-elicitation');
          expect(registeredTools).toContain('trigger-sampling-request');

          // Task-based tools are registered via experimental.tasks.registerToolTask
          expect(mockServerWithCapabilities.experimental.tasks.registerToolTask).toHaveBeenCalled();
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});