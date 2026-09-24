import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { SequentialThinkingServer, ThoughtData } from '../lib.js';


describe('SequentialThinkingServer', () => {
  let server: SequentialThinkingServer;
  beforeEach(() => {
      // Disable thought logging for tests
      process.env.DISABLE_THOUGHT_LOGGING = 'true';
      server = new SequentialThinkingServer();
    });

  describe('processThought - edge cases', () => {

    // ── TARGET TEST ─────────────────────────────────
    it('should handle very long thought strings', () => {
          const input = {
            thought: 'a'.repeat(10000),
            thoughtNumber: 1,
            totalThoughts: 1,
            nextThoughtNeeded: false
          };

          const result = server.processThought(input);
          expect(result.isError).toBeUndefined();
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});