import { describe, it, expect, afterEach } from 'vitest';
import { normalizePath, expandHome, convertToWindowsPath } from '../path-utils.js';


describe('Path Utilities', () => {

  describe('normalizePath', () => {

    // ── TARGET TEST ─────────────────────────────────
    it('always preserves WSL paths (they work correctly in WSL)', () => {
          // WSL paths should ALWAYS be preserved, regardless of platform
          // This is the fix for issue #2795
          expect(normalizePath('/mnt/c/NS/MyKindleContent'))
            .toBe('/mnt/c/NS/MyKindleContent');
          expect(normalizePath('/mnt/d/Documents'))
            .toBe('/mnt/d/Documents');
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});