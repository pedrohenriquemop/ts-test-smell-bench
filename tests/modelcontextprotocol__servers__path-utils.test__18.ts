import { describe, it, expect, afterEach } from 'vitest';
import { normalizePath, expandHome, convertToWindowsPath } from '../path-utils.js';


describe('Path Utilities', () => {

  describe('expandHome', () => {

    // ── TARGET TEST ─────────────────────────────────
    it('expands ~ to home directory', () => {
          const result = expandHome('~/test');
          expect(result).toContain('test');
          expect(result).not.toContain('~');
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});