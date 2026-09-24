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

  describe('blobResource', () => {

    // ── TARGET TEST ─────────────────────────────────
    it('should create blob resource with correct structure', () => {
          const uri = blobResourceUri(1);
          const resource = blobResource(uri, 1);

          expect(resource.uri).toBe(uri.toString());
          expect(resource.mimeType).toBe('text/plain');
          expect(resource.blob).toBeDefined();
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});