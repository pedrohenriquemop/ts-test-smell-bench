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


describe('Session Resources', () => {

  describe('registerSessionResource', () => {

    // ── TARGET TEST ─────────────────────────────────
    it('should register text resource and return resource link', () => {
          const registrations: any[] = [];
          const mockServer = {
            registerResource: vi.fn((...args) => {
              registrations.push(args);
            }),
          } as unknown as McpServer;

          const resource = {
            uri: 'demo://resource/session/test-file',
            name: 'test-file',
            mimeType: 'text/plain',
            description: 'A test file',
          };

          const result = registerSessionResource(
            mockServer,
            resource,
            'text',
            'Hello, World!'
          );

          expect(result.type).toBe('resource_link');
          expect(result.uri).toBe(resource.uri);
          expect(result.name).toBe(resource.name);

          expect(mockServer.registerResource).toHaveBeenCalledWith(
            'test-file',
            'demo://resource/session/test-file',
            expect.objectContaining({
              mimeType: 'text/plain',
              description: 'A test file',
            }),
            expect.any(Function)
          );
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});