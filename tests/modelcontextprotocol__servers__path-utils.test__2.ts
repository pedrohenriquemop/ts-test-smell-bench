import { describe, it, expect, afterEach } from 'vitest';
import { normalizePath, expandHome, convertToWindowsPath } from '../path-utils.js';


describe('Path Utilities', () => {

  describe('convertToWindowsPath', () => {

    // ── TARGET TEST ─────────────────────────────────
    it('converts Unix-style Windows paths only on Windows platform', () => {
          // On Windows, /c/ style paths should be converted
          if (process.platform === 'win32') {
            expect(convertToWindowsPath('/c/NS/MyKindleContent'))
              .toBe('C:\\NS\\MyKindleContent');
          } else {
            // On Linux, leave them unchanged
            expect(convertToWindowsPath('/c/NS/MyKindleContent'))
              .toBe('/c/NS/MyKindleContent');
          }
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});