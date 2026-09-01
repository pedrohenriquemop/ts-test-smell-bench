import { describe, it, expect, afterEach } from 'vitest';
import { normalizePath, expandHome, convertToWindowsPath } from '../path-utils.js';


describe('Path Utilities', () => {

  describe('convertToWindowsPath', () => {

    // ── TARGET TEST ─────────────────────────────────
    it('handles Windows paths with spaces', () => {
          expect(convertToWindowsPath('C:\\Program Files\\Some App'))
            .toBe('C:\\Program Files\\Some App');
          expect(convertToWindowsPath('C:/Program Files/Some App'))
            .toBe('C:\\Program Files\\Some App');
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});