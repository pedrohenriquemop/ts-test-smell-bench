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


describe('Session Resources', () => {

  describe('registerSessionResource', () => {

    // ── TARGET TEST ─────────────────────────────────
    it('should return resource handler that provides correct content', async () => {
          let capturedHandler: Function | null = null;
          const mockServer = {
            registerResource: vi.fn((_name, _uri, _config, handler) => {
              capturedHandler = handler;
            }),
          } as unknown as McpServer;

          const resource = {
            uri: 'demo://resource/session/content-test',
            name: 'content-test',
            mimeType: 'text/plain',
          };

          registerSessionResource(mockServer, resource, 'text', 'Test content here');

          expect(capturedHandler).not.toBeNull();

          const handlerResult = await capturedHandler!(new URL(resource.uri));
          expect(handlerResult.contents).toHaveLength(1);
          expect(handlerResult.contents[0].text).toBe('Test content here');
          expect(handlerResult.contents[0].mimeType).toBe('text/plain');
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});