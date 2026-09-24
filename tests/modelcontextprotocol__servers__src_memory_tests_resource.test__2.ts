import { describe, it, expect, vi } from 'vitest';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { SubscribeRequestSchema, UnsubscribeRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import {
  KnowledgeGraphManager,
  registerKnowledgeGraphResource,
  registerKnowledgeGraphSubscriptions,
} from '../index.js';


describe('knowledge-graph resource subscriptions', () => {
  function makeMockServer() {
      const inner = {
        registerCapabilities: vi.fn(),
        setRequestHandler: vi.fn(),
        sendResourceUpdated: vi.fn(),
      };
      const mockServer = { server: inner } as unknown as McpServer;
      return { mockServer, inner };
    }
  function handlerFor(inner: ReturnType<typeof makeMockServer>['inner'], schema: unknown) {
      const call = inner.setRequestHandler.mock.calls.find((c) => c[0] === schema);
      if (!call) throw new Error('handler not registered');
      return call[1] as (request: { params: { uri: string } }) => Promise<unknown>;
    }

  // ── TARGET TEST ─────────────────────────────────
  it('declares the resources.subscribe capability', () => {
      const { mockServer, inner } = makeMockServer();

      registerKnowledgeGraphSubscriptions(mockServer);

      expect(inner.registerCapabilities).toHaveBeenCalledWith({
        resources: { subscribe: true },
      });
    })
  // ── END TARGET TEST ─────────────────────────────
});