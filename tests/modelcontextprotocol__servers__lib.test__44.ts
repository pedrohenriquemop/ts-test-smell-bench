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

    describe('headFile', () => {

      // ── TARGET TEST ─────────────────────────────────
      it('handles files with leftover content', async () => {
              const mockFileHandle = {
                read: vi.fn(),
                close: vi.fn()
              } as any;

              // Simulate reading file content without final newline
              mockFileHandle.read
                .mockResolvedValueOnce({ bytesRead: 15, buffer: Buffer.from('line1\nline2\nend') })
                .mockResolvedValueOnce({ bytesRead: 0 });
              mockFileHandle.close.mockResolvedValue(undefined);

              mockFs.open.mockResolvedValue(mockFileHandle);

              const result = await headFile('/test/file.txt', 5);

              expect(mockFileHandle.close).toHaveBeenCalled();
            })
      // ── END TARGET TEST ─────────────────────────────
    });
  });
});