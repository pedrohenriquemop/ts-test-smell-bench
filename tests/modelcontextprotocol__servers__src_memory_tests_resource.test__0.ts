import { describe, it, expect, vi } from 'vitest';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { SubscribeRequestSchema, UnsubscribeRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import {
  KnowledgeGraphManager,
  registerKnowledgeGraphResource,
  registerKnowledgeGraphSubscriptions,
} from '../index.js';


describe('knowledge-graph resource', () => {

  // ── TARGET TEST ─────────────────────────────────
  it('registers with kebab-case name, correct URI, and JSON mime type', () => {
      const mockServer = { registerResource: vi.fn() } as unknown as McpServer;
      const manager = {} as KnowledgeGraphManager;

      registerKnowledgeGraphResource(mockServer, manager);

      expect(mockServer.registerResource).toHaveBeenCalledWith(
        'knowledge-graph',
        'memory://knowledge-graph',
        expect.objectContaining({
          title: 'Knowledge Graph',
          mimeType: 'application/json',
        }),
        expect.any(Function),
      );
    })
  // ── END TARGET TEST ─────────────────────────────
});