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
      it('treats dollar signs in replacement text literally', async () => {
              const edits = [
                { oldText: 'line2', newText: "price=$$; match=$&; before=$`; after=$'" }
              ];

              mockFs.rename.mockResolvedValueOnce(undefined);

              await applyFileEdits('/test/file.txt', edits, false);

              expect(mockFs.writeFile).toHaveBeenCalledWith(
                expect.stringMatching(/\/test\/file\.txt\.[a-f0-9]+\.tmp$/),
                "line1\nprice=$$; match=$&; before=$`; after=$'\nline3\n",
                'utf-8'
              );
            })
      // ── END TARGET TEST ─────────────────────────────
    });
  });
});