import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { SequentialThinkingServer, ThoughtData } from '../lib.js';


describe('SequentialThinkingServer', () => {
  let server: SequentialThinkingServer;
  beforeEach(() => {
      // Disable thought logging for tests
      process.env.DISABLE_THOUGHT_LOGGING = 'true';
      server = new SequentialThinkingServer();
    });

  describe('processThought - valid inputs', () => {

    // ── TARGET TEST ─────────────────────────────────
    it('should track multiple thoughts in history', () => {
          const input1 = {
            thought: 'First thought',
            thoughtNumber: 1,
            totalThoughts: 3,
            nextThoughtNeeded: true
          };

          const input2 = {
            thought: 'Second thought',
            thoughtNumber: 2,
            totalThoughts: 3,
            nextThoughtNeeded: true
          };

          const input3 = {
            thought: 'Final thought',
            thoughtNumber: 3,
            totalThoughts: 3,
            nextThoughtNeeded: false
          };

          server.processThought(input1);
          server.processThought(input2);
          const result = server.processThought(input3);

          const data = JSON.parse(result.content[0].text);
          expect(data.thoughtHistoryLength).toBe(3);
          expect(data.nextThoughtNeeded).toBe(false);
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});