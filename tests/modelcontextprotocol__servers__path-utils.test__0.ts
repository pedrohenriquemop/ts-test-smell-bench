import { describe, it, expect, afterEach } from 'vitest';
import { normalizePath, expandHome, convertToWindowsPath } from '../path-utils.js';


describe('Path Utilities', () => {

  describe('convertToWindowsPath', () => {

    // ── TARGET TEST ─────────────────────────────────
    it('leaves Unix paths unchanged', () => {
          expect(convertToWindowsPath('/usr/local/bin'))
            .toBe('/usr/local/bin');
          expect(convertToWindowsPath('/home/user/some path'))
            .toBe('/home/user/some path');
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});