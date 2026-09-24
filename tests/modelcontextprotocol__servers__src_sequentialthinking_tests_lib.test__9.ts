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
    it('should return correct response structure on success', () => {
          const input = {
            thought: 'Test thought',
            thoughtNumber: 1,
            totalThoughts: 1,
            nextThoughtNeeded: false
          };

          const result = server.processThought(input);

          expect(result).toHaveProperty('content');
          expect(Array.isArray(result.content)).toBe(true);
          expect(result.content.length).toBe(1);
          expect(result.content[0]).toHaveProperty('type', 'text');
          expect(result.content[0]).toHaveProperty('text');
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});