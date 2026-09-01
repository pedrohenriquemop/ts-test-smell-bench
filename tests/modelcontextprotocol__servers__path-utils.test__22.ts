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
    it('should also preserve WSL paths when running on Windows', () => {
          // Mock Windows platform
          Object.defineProperty(process, 'platform', {
            value: 'win32',
            writable: true,
            configurable: true
          });

          // WSL paths should still be preserved (though they wouldn't be accessible from Windows Node.js)
          expect(normalizePath('/mnt/c/Users/username/folder'))
            .toBe('/mnt/c/Users/username/folder');

          expect(normalizePath('/mnt/d/Documents/project'))
            .toBe('/mnt/d/Documents/project');
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});