import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { SequentialThinkingServer, ThoughtData } from '../lib.js';


describe('SequentialThinkingServer', () => {
  let server: SequentialThinkingServer;
  beforeEach(() => {
      // Disable thought logging for tests
      process.env.DISABLE_THOUGHT_LOGGING = 'true';
      server = new SequentialThinkingServer();
    });

  describe('processThought - with logging enabled', () => {
    let serverWithLogging: SequentialThinkingServer;
    beforeEach(() => {
          // Enable thought logging for these tests
          delete process.env.DISABLE_THOUGHT_LOGGING;
          serverWithLogging = new SequentialThinkingServer();
        });
    afterEach(() => {
          // Reset to disabled for other tests
          process.env.DISABLE_THOUGHT_LOGGING = 'true';
        });

    // ── TARGET TEST ─────────────────────────────────
    it('should format and log revision thoughts', () => {
          const input = {
            thought: 'Revised thought',
            thoughtNumber: 2,
            totalThoughts: 3,
            nextThoughtNeeded: true,
            isRevision: true,
            revisesThought: 1
          };

          const result = serverWithLogging.processThought(input);
          expect(result.isError).toBeUndefined();
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});