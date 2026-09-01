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
  setSubscriptionHandlers,
  beginSimulatedResourceUpdates,
  stopSimulatedResourceUpdates,
} from '../resources/subscriptions.js';


describe('Subscriptions', () => {

  describe('setSubscriptionHandlers', () => {

    // ── TARGET TEST ─────────────────────────────────
    it('should set request handlers on server', () => {
          const mockServer = {
            server: {
              setRequestHandler: vi.fn(),
            },
            sendLoggingMessage: vi.fn(),
          } as unknown as McpServer;

          setSubscriptionHandlers(mockServer);

          // Should set both subscribe and unsubscribe handlers
          expect(mockServer.server.setRequestHandler).toHaveBeenCalledTimes(2);
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});