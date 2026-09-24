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
    it('should create valid base64 encoded content', () => {
          const uri = blobResourceUri(3);
          const resource = blobResource(uri, 3);

          // Decode and verify content
          const decoded = Buffer.from(resource.blob, 'base64').toString();
          expect(decoded).toContain('Resource 3');
          expect(decoded).toContain('base64 blob');
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});