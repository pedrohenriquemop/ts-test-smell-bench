import { describe, it, expect, afterEach } from 'vitest';
import { normalizePath, expandHome, convertToWindowsPath } from '../path-utils.js';


describe('Path Utilities', () => {

  describe('normalizePath', () => {

    // ── TARGET TEST ─────────────────────────────────
    it('converts forward slashes to backslashes on Windows', () => {
          expect(normalizePath('C:/NS/MyKindleContent'))
            .toBe('C:\\NS\\MyKindleContent');
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});