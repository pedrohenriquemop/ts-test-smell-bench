import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import {
  // Pure utility functions
  formatSize,
  normalizeLineEndings,
  createUnifiedDiff,
  // Security & validation functions
  validatePath,
  setAllowedDirectories,
  // File operations
  getFileStats,
  readFileContent,
  writeFileContent,
  // Search & filtering functions
  searchFilesWithValidation,
  // File editing functions
  applyFileEdits,
  tailFile,
  headFile
} from '../lib.js';

vi.mock('fs/promises');
const mockFs = fs as any;

describe('Lib Functions', () => {
  beforeEach(() => {
      vi.clearAllMocks();
      // Set up allowed directories for tests
      const allowedDirs = process.platform === 'win32' ? ['C:\\Users\\test', 'C:\\temp', 'C:\\allowed'] : ['/home/user', '/tmp', '/allowed'];
      setAllowedDirectories(allowedDirs);
    });
  afterEach(() => {
      vi.restoreAllMocks();
      // Clear allowed directories after tests
      setAllowedDirectories([]);
    });

  describe('Security & Validation Functions', () => {

    describe('validatePath', () => {
      const allowedDirs = process.platform === 'win32' ? ['C:\\Users\\test', 'C:\\temp'] : ['/home/user', '/tmp'];
      beforeEach(() => {
              mockFs.realpath.mockImplementation(async (path: any) => path.toString());
            });

      // ── TARGET TEST ─────────────────────────────────
      it('resolves relative paths against allowed directories instead of process.cwd()', async () => {
              const relativePath = 'test-file.txt';
              const originalCwd = process.cwd;

              // Mock process.cwd to return a directory outside allowed directories
              const disallowedCwd = process.platform === 'win32' ? 'C:\\Windows\\System32' : '/root';
              (process as any).cwd = vi.fn(() => disallowedCwd);

              try {
                const result = await validatePath(relativePath);

                // Result should be resolved against first allowed directory, not process.cwd()
                const expectedPath = process.platform === 'win32' 
                  ? path.resolve('C:\\Users\\test', relativePath)
                  : path.resolve('/home/user', relativePath);

                expect(result).toBe(expectedPath);
                expect(result).not.toContain(disallowedCwd);
              } finally {
                // Restore original process.cwd
                process.cwd = originalCwd;
              }
            })
      // ── END TARGET TEST ─────────────────────────────
    });
  });
});