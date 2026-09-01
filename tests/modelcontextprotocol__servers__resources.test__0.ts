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

  describe('Constants', () => {

    // ── TARGET TEST ─────────────────────────────────
    it('should include both types in RESOURCE_TYPES array', () => {
          expect(RESOURCE_TYPES).toContain(RESOURCE_TYPE_TEXT);
          expect(RESOURCE_TYPES).toContain(RESOURCE_TYPE_BLOB);
          expect(RESOURCE_TYPES).toHaveLength(2);
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});