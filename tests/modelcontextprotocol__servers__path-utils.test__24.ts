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
    it('should NOT convert Unix-style paths (/c/) when running inside WSL (linux)', () => {
          // Mock process.platform to be 'linux' (WSL/Linux)
          Object.defineProperty(process, 'platform', {
            value: 'linux',
            writable: true,
            configurable: true
          });

          // When on Linux, /c/ is just a regular Unix directory, not a drive letter
          expect(normalizePath('/c/some/path'))
            .toBe('/c/some/path');

          expect(normalizePath('/d/another/path'))
            .toBe('/d/another/path');
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});