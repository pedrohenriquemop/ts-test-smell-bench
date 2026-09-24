import { describe, it, expect, vi } from 'vitest';
import { createServer } from '../server/index.js';


describe('Server Factory', () => {

  describe('createServer', () => {

    // ── TARGET TEST ─────────────────────────────────
    it('should have an oninitialized handler set', () => {
          const { server } = createServer();

          expect(server.server.oninitialized).toBeDefined();
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});