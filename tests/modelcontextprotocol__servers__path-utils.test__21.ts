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
    it('should NEVER convert WSL paths - they work correctly in WSL with Node.js fs', () => {
          // The key insight: When running `wsl npx ...`, Node.js runs INSIDE WSL (process.platform === 'linux')
          // and /mnt/c/ paths work correctly with Node.js fs operations in that environment.
          // Converting them to C:\ format breaks fs operations because Windows paths don't work inside WSL.

          // Mock Linux platform (inside WSL)
          Object.defineProperty(process, 'platform', {
            value: 'linux',
            writable: true,
            configurable: true
          });

          // WSL paths should NOT be converted, even inside WSL
          expect(normalizePath('/mnt/c/Users/username/folder'))
            .toBe('/mnt/c/Users/username/folder');

          expect(normalizePath('/mnt/d/Documents/project'))
            .toBe('/mnt/d/Documents/project');
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});