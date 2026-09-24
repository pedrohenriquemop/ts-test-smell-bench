import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { SequentialThinkingServer, ThoughtData } from '../lib.js';


describe('SequentialThinkingServer', () => {
  let server: SequentialThinkingServer;
  beforeEach(() => {
      // Disable thought logging for tests
      process.env.DISABLE_THOUGHT_LOGGING = 'true';
      server = new SequentialThinkingServer();
    });

  describe('processThought - branching', () => {

    // ── TARGET TEST ─────────────────────────────────
    it('should track branches correctly', () => {
          const input1 = {
            thought: 'Main thought',
            thoughtNumber: 1,
            totalThoughts: 3,
            nextThoughtNeeded: true
          };

          const input2 = {
            thought: 'Branch A thought',
            thoughtNumber: 2,
            totalThoughts: 3,
            nextThoughtNeeded: true,
            branchFromThought: 1,
            branchId: 'branch-a'
          };

          const input3 = {
            thought: 'Branch B thought',
            thoughtNumber: 2,
            totalThoughts: 3,
            nextThoughtNeeded: false,
            branchFromThought: 1,
            branchId: 'branch-b'
          };

          server.processThought(input1);
          server.processThought(input2);
          const result = server.processThought(input3);

          const data = JSON.parse(result.content[0].text);
          expect(data.branches).toContain('branch-a');
          expect(data.branches).toContain('branch-b');
          expect(data.branches.length).toBe(2);
          expect(data.thoughtHistoryLength).toBe(3);
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});