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
      it('applies simple text replacement', async () => {
              const edits = [
                { oldText: 'line2', newText: 'modified line2' }
              ];

              mockFs.rename.mockResolvedValueOnce(undefined);

              const result = await applyFileEdits('/test/file.txt', edits, false);

              expect(result).toContain('modified line2');
              // Should write to temporary file then rename
              expect(mockFs.writeFile).toHaveBeenCalledWith(
                expect.stringMatching(/\/test\/file\.txt\.[a-f0-9]+\.tmp$/),
                'line1\nmodified line2\nline3\n',
                'utf-8'
              );
              expect(mockFs.rename).toHaveBeenCalledWith(
                expect.stringMatching(/\/test\/file\.txt\.[a-f0-9]+\.tmp$/),
                '/test/file.txt'
              );
            })
      // ── END TARGET TEST ─────────────────────────────
    });
  });
});