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

  describe('resourceIdForPromptCompleter', () => {

    // ── TARGET TEST ─────────────────────────────────
    it('should be defined as a completable schema', () => {
          expect(resourceIdForPromptCompleter).toBeDefined();
          expect(typeof (resourceIdForPromptCompleter as any).parse).toBe('function');
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});