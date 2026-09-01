import { describe, it, expect, afterEach } from 'vitest';
import { normalizePath, expandHome, convertToWindowsPath } from '../path-utils.js';


describe('Path Utilities', () => {

  describe('normalizePath', () => {

    // ── TARGET TEST ─────────────────────────────────
    it('removes surrounding quotes', () => {
          expect(normalizePath('"C:\\NS\\My Kindle Content"'))
            .toBe('C:\\NS\\My Kindle Content');
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});