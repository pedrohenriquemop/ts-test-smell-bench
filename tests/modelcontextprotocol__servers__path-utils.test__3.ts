import { describe, it, expect, afterEach } from 'vitest';
import { normalizePath, expandHome, convertToWindowsPath } from '../path-utils.js';


describe('Path Utilities', () => {

  describe('convertToWindowsPath', () => {

    // ── TARGET TEST ─────────────────────────────────
    it('leaves Windows paths unchanged but ensures backslashes', () => {
          expect(convertToWindowsPath('C:\\NS\\MyKindleContent'))
            .toBe('C:\\NS\\MyKindleContent');
          expect(convertToWindowsPath('C:/NS/MyKindleContent'))
            .toBe('C:\\NS\\MyKindleContent');
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});