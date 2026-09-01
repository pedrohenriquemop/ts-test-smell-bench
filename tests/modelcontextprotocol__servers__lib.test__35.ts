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
      it('handles complex multi-line edits with indentation', async () => {
              mockFs.readFile.mockResolvedValue('function test() {\n  console.log("hello");\n  return true;\n}');

              const edits = [
                { 
                  oldText: '  console.log("hello");\n  return true;', 
                  newText: '  console.log("world");\n  console.log("test");\n  return false;' 
                }
              ];

              mockFs.rename.mockResolvedValueOnce(undefined);

              await applyFileEdits('/test/file.js', edits, false);

              expect(mockFs.writeFile).toHaveBeenCalledWith(
                expect.stringMatching(/\/test\/file\.js\.[a-f0-9]+\.tmp$/),
                'function test() {\n  console.log("world");\n  console.log("test");\n  return false;\n}',
                'utf-8'
              );
              expect(mockFs.rename).toHaveBeenCalledWith(
                expect.stringMatching(/\/test\/file\.js\.[a-f0-9]+\.tmp$/),
                '/test/file.js'
              );
            })
      // ── END TARGET TEST ─────────────────────────────
    });
  });
});