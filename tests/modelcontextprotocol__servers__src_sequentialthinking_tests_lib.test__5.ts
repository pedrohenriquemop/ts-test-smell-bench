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
    it('should allow multiple thoughts in same branch', () => {
          const input1 = {
            thought: 'Branch thought 1',
            thoughtNumber: 1,
            totalThoughts: 2,
            nextThoughtNeeded: true,
            branchFromThought: 1,
            branchId: 'branch-a'
          };

          const input2 = {
            thought: 'Branch thought 2',
            thoughtNumber: 2,
            totalThoughts: 2,
            nextThoughtNeeded: false,
            branchFromThought: 1,
            branchId: 'branch-a'
          };

          server.processThought(input1);
          const result = server.processThought(input2);

          const data = JSON.parse(result.content[0].text);
          expect(data.branches).toContain('branch-a');
          expect(data.branches.length).toBe(1);
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});