import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import {
  textResource,
  blobResource,
  textResourceUri,
  blobResourceUri,
  RESOURCE_TYPE_TEXT,
  RESOURCE_TYPE_BLOB,
  RESOURCE_TYPES,
  resourceTypeCompleter,
  resourceIdForPromptCompleter,
  resourceIdForResourceTemplateCompleter,
  registerResourceTemplates,
} from '../resources/templates.js';
import {
  getSessionResourceURI,
  registerSessionResource,
} from '../resources/session.js';
import { registerFileResources } from '../resources/files.js';
import {
  SubscribeRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import {
  setSubscriptionHandlers,
  beginSimulatedResourceUpdates,
  stopSimulatedResourceUpdates,
  removeSubscriber,
} from '../resources/subscriptions.js';


describe('Subscriptions', () => {

  describe('removeSubscriber', () => {
    const testUri = 'demo://resource/dynamic/text/1';
    const sessionId = 'disconnect-test-session';
    let subscribeHandler: (
          request: { params: { uri: string } },
          extra: { sessionId: string }
        ) => Promise<unknown>;
    beforeEach(() => {
          const handlers = new Map<unknown, typeof subscribeHandler>();
          const mockServer = {
            server: {
              setRequestHandler: vi.fn((schema, handler) => {
                handlers.set(schema, handler);
              }),
              notification: vi.fn(),
            },
            sendLoggingMessage: vi.fn(),
          } as unknown as McpServer;

          setSubscriptionHandlers(mockServer);
          subscribeHandler = handlers.get(SubscribeRequestSchema)!;
        });
    afterEach(() => {
          stopSimulatedResourceUpdates(sessionId);
          removeSubscriber(sessionId);
        });

    // ── TARGET TEST ─────────────────────────────────
    it('should drop a disconnected session from all subscriptions', async () => {
          const notification = vi.fn();
          const mockServer = {
            server: {
              notification,
            },
          } as unknown as McpServer;

          await subscribeHandler({ params: { uri: testUri } }, { sessionId });

          beginSimulatedResourceUpdates(mockServer, sessionId);
          expect(notification).toHaveBeenCalled();

          notification.mockClear();
          removeSubscriber(sessionId);
          stopSimulatedResourceUpdates(sessionId);

          beginSimulatedResourceUpdates(mockServer, sessionId);
          expect(notification).not.toHaveBeenCalled();
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});