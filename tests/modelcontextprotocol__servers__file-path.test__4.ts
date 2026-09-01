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

  describe('without MEMORY_FILE_PATH environment variable', () => {

    // ── TARGET TEST ─────────────────────────────────
    it('should migrate from memory.json to memory.jsonl when only old file exists', async () => {
          // Create old memory.json file
          await fs.writeFile(oldMemoryPath, '{"test":"data"}');

          const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

          const result = await ensureMemoryFilePath();

          expect(result).toBe(defaultMemoryPath);

          // Verify migration happened
          const newFileExists = await fs.access(newMemoryPath).then(() => true).catch(() => false);
          const oldFileExists = await fs.access(oldMemoryPath).then(() => true).catch(() => false);

          expect(newFileExists).toBe(true);
          expect(oldFileExists).toBe(false);

          // Verify console messages
          expect(consoleErrorSpy).toHaveBeenCalledWith(
            expect.stringContaining('DETECTED: Found legacy memory.json file')
          );
          expect(consoleErrorSpy).toHaveBeenCalledWith(
            expect.stringContaining('COMPLETED: Successfully migrated')
          );

          consoleErrorSpy.mockRestore();
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});