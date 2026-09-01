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

  describe('File Operations', () => {

    describe('getFileStats', () => {

      // ── TARGET TEST ─────────────────────────────────
      it('handles directory statistics', async () => {
              const mockStats = {
                size: 4096,
                birthtime: new Date('2023-01-01'),
                mtime: new Date('2023-01-02'),
                atime: new Date('2023-01-03'),
                isDirectory: () => true,
                isFile: () => false,
                mode: 0o755
              };

              mockFs.stat.mockResolvedValueOnce(mockStats as any);

              const result = await getFileStats('/test/dir');

              expect(result.isDirectory).toBe(true);
              expect(result.isFile).toBe(false);
              expect(result.permissions).toBe('755');
            })
      // ── END TARGET TEST ─────────────────────────────
    });
  });
});