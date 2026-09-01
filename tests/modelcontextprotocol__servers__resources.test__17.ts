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

  describe('getSessionResourceURI', () => {

    // ── TARGET TEST ─────────────────────────────────
    it('should handle various resource names', () => {
          expect(getSessionResourceURI('my-file')).toBe('demo://resource/session/my-file');
          expect(getSessionResourceURI('document_123')).toBe(
            'demo://resource/session/document_123'
          );
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});