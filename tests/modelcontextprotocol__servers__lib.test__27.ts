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

  describe('Search & Filtering Functions', () => {

    describe('searchFilesWithValidation', () => {
      beforeEach(() => {
              mockFs.realpath.mockImplementation(async (path: any) => path.toString());
            });

      // ── TARGET TEST ─────────────────────────────────
      it('handles validation errors during search', async () => {
              const mockEntries = [
                { name: 'test.txt', isDirectory: () => false },
                { name: 'invalid_file.txt', isDirectory: () => false }
              ];

              mockFs.readdir.mockResolvedValueOnce(mockEntries as any);

              // Mock validatePath to throw error for invalid_file.txt
              mockFs.realpath.mockImplementation(async (path: any) => {
                if (path.toString().includes('invalid_file.txt')) {
                  throw new Error('Access denied');
                }
                return path.toString();
              });

              const testDir = process.platform === 'win32' ? 'C:\\allowed\\dir' : '/allowed/dir';
              const allowedDirs = process.platform === 'win32' ? ['C:\\allowed'] : ['/allowed'];

              const result = await searchFilesWithValidation(
                testDir,
                '*test*',
                allowedDirs,
                {}
              );

              // Should only return the valid file, skipping the invalid one
              const expectedResult = process.platform === 'win32' ? 'C:\\allowed\\dir\\test.txt' : '/allowed/dir/test.txt';
              expect(result).toEqual([expectedResult]);
            })
      // ── END TARGET TEST ─────────────────────────────
    });
  });
});