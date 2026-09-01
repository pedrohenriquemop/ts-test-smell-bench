import { describe, it, expect, afterEach } from 'vitest';
import { normalizePath, expandHome, convertToWindowsPath } from '../path-utils.js';


describe('Path Utilities', () => {

  describe('expandHome', () => {

    // ── TARGET TEST ─────────────────────────────────
    it('expands bare ~ to home directory', () => {
          const result = expandHome('~');
          expect(result).not.toContain('~');
          expect(result.length).toBeGreaterThan(0);
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});