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

  describe('Pure Utility Functions', () => {

    describe('createUnifiedDiff', () => {

      // ── TARGET TEST ─────────────────────────────────
      it('creates diff for simple changes', () => {
              const original = 'line1\nline2\nline3';
              const modified = 'line1\nmodified line2\nline3';
              const diff = createUnifiedDiff(original, modified, 'test.txt');

              expect(diff).toContain('--- test.txt');
              expect(diff).toContain('+++ test.txt');
              expect(diff).toContain('-line2');
              expect(diff).toContain('+modified line2');
            })
      // ── END TARGET TEST ─────────────────────────────
    });
  });
});