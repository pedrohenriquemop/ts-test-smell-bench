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
    it('should handle nextThoughtNeeded = false', () => {
          const input = {
            thought: 'Final thought',
            thoughtNumber: 3,
            totalThoughts: 3,
            nextThoughtNeeded: false
          };

          const result = server.processThought(input);
          const data = JSON.parse(result.content[0].text);

          expect(data.nextThoughtNeeded).toBe(false);
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});