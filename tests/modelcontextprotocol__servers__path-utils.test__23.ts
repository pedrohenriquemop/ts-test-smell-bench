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
    it('should convert Unix-style Windows paths (/c/) only when running on Windows (win32)', () => {
          // Mock process.platform to be 'win32' (Windows)
          Object.defineProperty(process, 'platform', {
            value: 'win32',
            writable: true,
            configurable: true
          });

          // Unix-style Windows paths like /c/ should be converted on Windows
          expect(normalizePath('/c/Users/username/folder'))
            .toBe('C:\\Users\\username\\folder');

          expect(normalizePath('/d/Documents/project'))
            .toBe('D:\\Documents\\project');
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});