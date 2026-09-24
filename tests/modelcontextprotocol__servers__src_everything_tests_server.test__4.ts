import { describe, it, expect, vi } from 'vitest';
import { createServer } from '../server/index.js';


describe('Server Factory', () => {

  describe('createServer', () => {

    // ── TARGET TEST ─────────────────────────────────
    it('should allow multiple servers to be created', () => {
          const result1 = createServer();
          const result2 = createServer();

          expect(result1.server).toBeDefined();
          expect(result2.server).toBeDefined();
          expect(result1.server).not.toBe(result2.server);
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});