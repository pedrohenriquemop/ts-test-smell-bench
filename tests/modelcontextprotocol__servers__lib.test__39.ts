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

  describe('File Editing Functions', () => {

    describe('tailFile', () => {

      // ── TARGET TEST ─────────────────────────────────
      it('calls stat to check file size', async () => {
              mockFs.stat.mockResolvedValue({ size: 100 } as any);

              // Mock file handle with proper typing
              const mockFileHandle = {
                read: vi.fn(),
                close: vi.fn()
              } as any;

              mockFileHandle.read.mockResolvedValue({ bytesRead: 0 });
              mockFileHandle.close.mockResolvedValue(undefined);

              mockFs.open.mockResolvedValue(mockFileHandle);

              await tailFile('/test/file.txt', 2);

              expect(mockFs.stat).toHaveBeenCalledWith('/test/file.txt');
              expect(mockFs.open).toHaveBeenCalledWith('/test/file.txt', 'r');
            })
      // ── END TARGET TEST ─────────────────────────────
    });
  });
});