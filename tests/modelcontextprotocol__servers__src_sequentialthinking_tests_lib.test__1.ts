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
    it('should accept thought with optional fields', () => {
          const input = {
            thought: 'Revising my earlier idea',
            thoughtNumber: 2,
            totalThoughts: 3,
            nextThoughtNeeded: true,
            isRevision: true,
            revisesThought: 1,
            needsMoreThoughts: false
          };

          const result = server.processThought(input);
          expect(result.isError).toBeUndefined();

          const data = JSON.parse(result.content[0].text);
          expect(data.thoughtNumber).toBe(2);
          expect(data.thoughtHistoryLength).toBe(1);
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});