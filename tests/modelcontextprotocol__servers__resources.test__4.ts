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


describe('Resource Templates', () => {

  describe('blobResourceUri', () => {

    // ── TARGET TEST ─────────────────────────────────
    it('should handle different resource IDs', () => {
          expect(blobResourceUri(5).toString()).toBe('demo://resource/dynamic/blob/5');
          expect(blobResourceUri(100).toString()).toBe('demo://resource/dynamic/blob/100');
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});