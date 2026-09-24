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
    it('should handle thoughtNumber = 1, totalThoughts = 1', () => {
          const input = {
            thought: 'Only thought',
            thoughtNumber: 1,
            totalThoughts: 1,
            nextThoughtNeeded: false
          };

          const result = server.processThought(input);
          expect(result.isError).toBeUndefined();

          const data = JSON.parse(result.content[0].text);
          expect(data.thoughtNumber).toBe(1);
          expect(data.totalThoughts).toBe(1);
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});