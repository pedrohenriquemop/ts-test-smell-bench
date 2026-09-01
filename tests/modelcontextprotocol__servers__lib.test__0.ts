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

    describe('formatSize', () => {

      // ── TARGET TEST ─────────────────────────────────
      it('formats bytes correctly', () => {
              expect(formatSize(0)).toBe('0 B');
              expect(formatSize(512)).toBe('512 B');
              expect(formatSize(1024)).toBe('1.00 KB');
              expect(formatSize(1536)).toBe('1.50 KB');
              expect(formatSize(1048576)).toBe('1.00 MB');
              expect(formatSize(1073741824)).toBe('1.00 GB');
              expect(formatSize(1099511627776)).toBe('1.00 TB');
            })
      // ── END TARGET TEST ─────────────────────────────
    });
  });
});