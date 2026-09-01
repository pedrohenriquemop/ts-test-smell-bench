import { describe, it, expect, vi } from 'vitest';
import { createServer } from '../server/index.js';


describe('Server Factory', () => {

  describe('createServer', () => {

    // ── TARGET TEST ─────────────────────────────────
    it('should create an McpServer instance', () => {
          const { server } = createServer();

          expect(server).toBeDefined();
          expect(server.server).toBeDefined();
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});