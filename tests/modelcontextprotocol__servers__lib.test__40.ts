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
      it('handles files with content and returns last lines', async () => {
              mockFs.stat.mockResolvedValue({ size: 50 } as any);

              const mockFileHandle = {
                read: vi.fn(),
                close: vi.fn()
              } as any;

              // Simulate reading file content in chunks
              mockFileHandle.read
                .mockResolvedValueOnce({ bytesRead: 20, buffer: Buffer.from('line3\nline4\nline5\n') })
                .mockResolvedValueOnce({ bytesRead: 0 });
              mockFileHandle.close.mockResolvedValue(undefined);

              mockFs.open.mockResolvedValue(mockFileHandle);

              const result = await tailFile('/test/file.txt', 2);

              expect(mockFileHandle.close).toHaveBeenCalled();
            })
      // ── END TARGET TEST ─────────────────────────────
    });
  });
});