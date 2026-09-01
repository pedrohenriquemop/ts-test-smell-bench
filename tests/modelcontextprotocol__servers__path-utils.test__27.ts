import { describe, it, expect, afterEach } from 'vitest';
import { normalizePath, expandHome, convertToWindowsPath } from '../path-utils.js';


describe('Path Utilities', () => {

  describe('WSL path handling (issue #2795 fix)', () => {
    const originalPlatform = process.platform;
    afterEach(() => {
          // Restore platform after each test
          Object.defineProperty(process, 'platform', {
            value: originalPlatform,
            writable: true,
            configurable: true
          });
        });

    // ── TARGET TEST ─────────────────────────────────
    it('normalizes bare Windows drive letters to the drive root on Windows', () => {
          Object.defineProperty(process, 'platform', {
            value: 'win32',
            writable: true,
            configurable: true
          });

          expect(normalizePath('C:')).toBe('C:\\');
          expect(normalizePath('d:')).toBe('D:\\');
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});