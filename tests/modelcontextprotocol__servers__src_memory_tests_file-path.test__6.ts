import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';
import { ensureMemoryFilePath, defaultMemoryPath, expandHome } from '../index.js';


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

  describe('without MEMORY_FILE_PATH environment variable', () => {

    // ── TARGET TEST ─────────────────────────────────
    it('should use new file when both old and new files exist', async () => {
          // Create both files
          await fs.writeFile(oldMemoryPath, '{"old":"data"}');
          await fs.writeFile(newMemoryPath, '{"new":"data"}');

          const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

          const result = await ensureMemoryFilePath();

          expect(result).toBe(defaultMemoryPath);

          // Verify no migration happened (both files should still exist)
          const newFileExists = await fs.access(newMemoryPath).then(() => true).catch(() => false);
          const oldFileExists = await fs.access(oldMemoryPath).then(() => true).catch(() => false);

          expect(newFileExists).toBe(true);
          expect(oldFileExists).toBe(true);

          // Verify no console messages about migration
          expect(consoleErrorSpy).not.toHaveBeenCalled();

          consoleErrorSpy.mockRestore();
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});