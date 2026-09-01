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
      it('handles non-existent files by checking parent directory', async () => {
              const newFilePath = process.platform === 'win32' ? 'C:\\Users\\test\\newfile.txt' : '/home/user/newfile.txt';
              const parentPath = process.platform === 'win32' ? 'C:\\Users\\test' : '/home/user';

              // Create an error with the ENOENT code that the implementation checks for
              const enoentError = new Error('ENOENT') as NodeJS.ErrnoException;
              enoentError.code = 'ENOENT';

              mockFs.realpath
                .mockRejectedValueOnce(enoentError)
                .mockResolvedValueOnce(parentPath);

              const result = await validatePath(newFilePath);
              expect(result).toBe(path.resolve(newFilePath));
            })
      // ── END TARGET TEST ─────────────────────────────
    });
  });
});