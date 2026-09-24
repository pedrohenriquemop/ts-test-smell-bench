import { describe, it, expect, vi } from 'vitest';
import { createServer } from '../server/index.js';


describe('Server Factory', () => {

  describe('createServer', () => {

    // ── TARGET TEST ─────────────────────────────────
    it('should return a ServerFactoryResponse object', () => {
          const result = createServer();

          expect(result).toHaveProperty('server');
          expect(result).toHaveProperty('cleanup');
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});