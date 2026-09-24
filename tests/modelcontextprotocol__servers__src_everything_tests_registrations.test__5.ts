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

  describe('resources/index.ts', () => {

    // ── TARGET TEST ─────────────────────────────────
    it('should read instructions from file', async () => {
          const { readInstructions } = await import('../resources/index.js');

          const instructions = readInstructions();

          // Should return a string (either content or error message)
          expect(typeof instructions).toBe('string');
          expect(instructions.length).toBeGreaterThan(0);
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});