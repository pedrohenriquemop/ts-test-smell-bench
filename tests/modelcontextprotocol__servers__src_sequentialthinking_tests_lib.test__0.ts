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
    it('should accept valid basic thought', () => {
          const input = {
            thought: 'This is my first thought',
            thoughtNumber: 1,
            totalThoughts: 3,
            nextThoughtNeeded: true
          };

          const result = server.processThought(input);
          expect(result.isError).toBeUndefined();

          const data = JSON.parse(result.content[0].text);
          expect(data.thoughtNumber).toBe(1);
          expect(data.totalThoughts).toBe(3);
          expect(data.nextThoughtNeeded).toBe(true);
          expect(data.thoughtHistoryLength).toBe(1);
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});