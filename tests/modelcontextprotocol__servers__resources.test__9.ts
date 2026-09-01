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

  describe('resourceTypeCompleter', () => {

    // ── TARGET TEST ─────────────────────────────────
    it('should be defined as a completable schema', () => {
          // The completer is a zod schema wrapped with completable
          expect(resourceTypeCompleter).toBeDefined();
          // It should have the zod parse method
          expect(typeof (resourceTypeCompleter as any).parse).toBe('function');
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});