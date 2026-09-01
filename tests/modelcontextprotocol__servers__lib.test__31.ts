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

    describe('applyFileEdits', () => {
      beforeEach(() => {
              mockFs.readFile.mockResolvedValue('line1\nline2\nline3\n');
              mockFs.writeFile.mockResolvedValue(undefined);
            });

      // ── TARGET TEST ─────────────────────────────────
      it('handles dry run mode', async () => {
              const edits = [
                { oldText: 'line2', newText: 'modified line2' }
              ];

              const result = await applyFileEdits('/test/file.txt', edits, true);

              expect(result).toContain('modified line2');
              expect(mockFs.writeFile).not.toHaveBeenCalled();
            })
      // ── END TARGET TEST ─────────────────────────────
    });
  });
});