import { describe, it, expect, afterEach } from 'vitest';
import { normalizePath, expandHome, convertToWindowsPath } from '../path-utils.js';


describe('Path Utilities', () => {

  describe('expandHome', () => {

    // ── TARGET TEST ─────────────────────────────────
    it('leaves other paths unchanged', () => {
          expect(expandHome('C:/test')).toBe('C:/test');
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});