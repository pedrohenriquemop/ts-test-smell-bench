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
      it('excludes files matching exclude patterns', async () => {
              const mockEntries = [
                { name: 'test.txt', isDirectory: () => false },
                { name: 'test.log', isDirectory: () => false },
                { name: 'node_modules', isDirectory: () => true }
              ];

              mockFs.readdir.mockResolvedValueOnce(mockEntries as any);

              const testDir = process.platform === 'win32' ? 'C:\\allowed\\dir' : '/allowed/dir';
              const allowedDirs = process.platform === 'win32' ? ['C:\\allowed'] : ['/allowed'];

              // Mock realpath to return the same path for validation to pass
              mockFs.realpath.mockImplementation(async (inputPath: any) => {
                const pathStr = inputPath.toString();
                // Return the path as-is for validation
                return pathStr;
              });

              const result = await searchFilesWithValidation(
                testDir,
                '*test*',
                allowedDirs,
                { excludePatterns: ['*.log', 'node_modules'] }
              );

              const expectedResult = process.platform === 'win32' ? 'C:\\allowed\\dir\\test.txt' : '/allowed/dir/test.txt';
              expect(result).toEqual([expectedResult]);
            })
      // ── END TARGET TEST ─────────────────────────────
    });
  });
});