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


describe('Subscriptions', () => {

  describe('simulated resource updates lifecycle', () => {
    afterEach(() => {
          // Clean up any intervals
          stopSimulatedResourceUpdates('lifecycle-test-session');
        });

    // ── TARGET TEST ─────────────────────────────────
    it('should start and stop updates without errors', () => {
          const mockServer = {
            server: {
              notification: vi.fn(),
            },
          } as unknown as McpServer;

          // Start updates - should work for both defined and undefined sessionId
          beginSimulatedResourceUpdates(mockServer, 'lifecycle-test-session');
          beginSimulatedResourceUpdates(mockServer, undefined);

          // Stop updates - should handle all cases gracefully
          stopSimulatedResourceUpdates('lifecycle-test-session');
          stopSimulatedResourceUpdates('non-existent-session');
          stopSimulatedResourceUpdates(undefined);

          // If we got here without throwing, the lifecycle works correctly
          expect(true).toBe(true);
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});