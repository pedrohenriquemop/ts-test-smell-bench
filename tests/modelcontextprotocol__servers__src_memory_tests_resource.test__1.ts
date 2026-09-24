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
  it('handler returns the graph as JSON in the contents array', async () => {
      const mockServer = { registerResource: vi.fn() } as unknown as McpServer;
      const fakeGraph = {
        entities: [{ name: 'Alice', entityType: 'person', observations: ['engineer'] }],
        relations: [{ from: 'Alice', to: 'Acme', relationType: 'works_at' }],
      };
      const manager = {
        readGraph: vi.fn().mockResolvedValue(fakeGraph),
      } as unknown as KnowledgeGraphManager;

      registerKnowledgeGraphResource(mockServer, manager);

      const handler = (mockServer.registerResource as ReturnType<typeof vi.fn>).mock.calls[0][3];
      const result = await handler(new URL('memory://knowledge-graph'));

      expect(result.contents).toHaveLength(1);
      expect(result.contents[0].uri).toBe('memory://knowledge-graph');
      expect(result.contents[0].mimeType).toBe('application/json');
      expect(JSON.parse(result.contents[0].text)).toEqual(fakeGraph);
      expect(manager.readGraph).toHaveBeenCalledOnce();
    })
  // ── END TARGET TEST ─────────────────────────────
});