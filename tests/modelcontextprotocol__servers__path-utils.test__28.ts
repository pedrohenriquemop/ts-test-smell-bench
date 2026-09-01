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
    it('should handle relative path slash conversion based on platform', () => {
          // This test verifies platform-specific behavior naturally without mocking
          // On Windows: forward slashes converted to backslashes
          // On Linux/Unix: forward slashes preserved
          const relativePath = 'some/relative/path';
          const result = normalizePath(relativePath);

          if (originalPlatform === 'win32') {
            expect(result).toBe('some\\relative\\path');
          } else {
            expect(result).toBe('some/relative/path');
          }
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});