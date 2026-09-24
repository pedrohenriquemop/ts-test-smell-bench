import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { SequentialThinkingServer, ThoughtData } from '../lib.js';


describe('SequentialThinkingServer', () => {
  let server: SequentialThinkingServer;
  beforeEach(() => {
      // Disable thought logging for tests
      process.env.DISABLE_THOUGHT_LOGGING = 'true';
      server = new SequentialThinkingServer();
    });

  describe('processThought - response format', () => {

    // ── TARGET TEST ─────────────────────────────────
    it('should return valid JSON in response', () => {
          const input = {
            thought: 'Test thought',
            thoughtNumber: 1,
            totalThoughts: 1,
            nextThoughtNeeded: false
          };

          const result = server.processThought(input);

          expect(() => JSON.parse(result.content[0].text)).not.toThrow();
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});