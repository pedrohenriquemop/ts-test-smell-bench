import { describe, it, expect, afterEach } from 'vitest';
import { normalizePath, expandHome, convertToWindowsPath } from '../path-utils.js';


describe('Path Utilities', () => {

  describe('normalizePath', () => {

    // ── TARGET TEST ─────────────────────────────────
    it('normalizes backslashes', () => {
          expect(normalizePath('C:\\\\NS\\\\MyKindleContent'))
            .toBe('C:\\NS\\MyKindleContent');
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});