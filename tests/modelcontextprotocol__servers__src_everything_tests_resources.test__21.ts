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


describe('File Resources', () => {

  describe('registerFileResources', () => {

    // ── TARGET TEST ─────────────────────────────────
    it('should register file resources when docs directory exists', () => {
          const mockServer = {
            registerResource: vi.fn(),
          } as unknown as McpServer;

          registerFileResources(mockServer);

          // The docs folder exists in the everything server and contains files
          // so registerResource should have been called
          expect(mockServer.registerResource).toHaveBeenCalled();
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});