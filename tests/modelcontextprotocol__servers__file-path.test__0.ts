import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ensureMemoryFilePath, defaultMemoryPath } from '../index.js';


describe('ensureMemoryFilePath', () => {
  const testDir = path.dirname(fileURLToPath(import.meta.url));
  const oldMemoryPath = path.join(testDir, '..', 'memory.json');
  const newMemoryPath = path.join(testDir, '..', 'memory.jsonl');
  let originalEnv: string | undefined;
  beforeEach(() => {
      // Save original environment variable
      originalEnv = process.env.MEMORY_FILE_PATH;
      // Delete environment variable
      delete process.env.MEMORY_FILE_PATH;
    });
  afterEach(async () => {
      // Restore original environment variable
      if (originalEnv !== undefined) {
        process.env.MEMORY_FILE_PATH = originalEnv;
      } else {
        delete process.env.MEMORY_FILE_PATH;
      }

      // Clean up test files
      try {
        await fs.unlink(oldMemoryPath);
      } catch {
        // Ignore if file doesn't exist
      }
      try {
        await fs.unlink(newMemoryPath);
      } catch {
        // Ignore if file doesn't exist
      }
    });

  describe('with MEMORY_FILE_PATH environment variable', () => {

    // ── TARGET TEST ─────────────────────────────────
    it('should return absolute path when MEMORY_FILE_PATH is absolute', async () => {
          const absolutePath = '/tmp/custom-memory.jsonl';
          process.env.MEMORY_FILE_PATH = absolutePath;

          const result = await ensureMemoryFilePath();

          expect(result).toBe(absolutePath);
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});