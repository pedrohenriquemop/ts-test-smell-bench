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


describe('Resource Templates', () => {

  describe('registerResourceTemplates', () => {

    // ── TARGET TEST ─────────────────────────────────
    it('should register text and blob resource templates', () => {
          const registeredResources: any[] = [];

          const mockServer = {
            registerResource: vi.fn((...args) => {
              registeredResources.push(args);
            }),
          } as unknown as McpServer;

          registerResourceTemplates(mockServer);

          expect(mockServer.registerResource).toHaveBeenCalledTimes(2);

          // Check text resource registration
          const textRegistration = registeredResources.find((r) =>
            r[0].includes('Text')
          );
          expect(textRegistration).toBeDefined();
          expect(textRegistration[1]).toBeInstanceOf(ResourceTemplate);

          // Check blob resource registration
          const blobRegistration = registeredResources.find((r) =>
            r[0].includes('Blob')
          );
          expect(blobRegistration).toBeDefined();
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});