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
    it('should register blob resource correctly', () => {
          const mockServer = {
            registerResource: vi.fn(),
          } as unknown as McpServer;

          const resource = {
            uri: 'demo://resource/session/binary-file',
            name: 'binary-file',
            mimeType: 'application/octet-stream',
          };

          const blobContent = Buffer.from('binary data').toString('base64');
          const result = registerSessionResource(mockServer, resource, 'blob', blobContent);

          expect(result.type).toBe('resource_link');
          expect(mockServer.registerResource).toHaveBeenCalled();
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});