import { describe, it, expect, vi } from 'vitest';
import { createServer } from '../server/index.js';


describe('Server Factory', () => {

  describe('createServer', () => {

    // ── TARGET TEST ─────────────────────────────────
    it('should return a cleanup function', () => {
          const { cleanup } = createServer();

          expect(typeof cleanup).toBe('function');
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});