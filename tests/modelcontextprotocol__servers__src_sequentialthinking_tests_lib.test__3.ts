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
    it('should auto-adjust totalThoughts if thoughtNumber exceeds it', () => {
          const input = {
            thought: 'Thought 5',
            thoughtNumber: 5,
            totalThoughts: 3,
            nextThoughtNeeded: true
          };

          const result = server.processThought(input);
          const data = JSON.parse(result.content[0].text);

          expect(data.totalThoughts).toBe(5);
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});