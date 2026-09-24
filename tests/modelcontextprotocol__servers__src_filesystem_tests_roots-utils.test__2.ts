import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { getValidRootDirectories } from '../roots-utils.js';
import { mkdtempSync, rmSync, mkdirSync, writeFileSync, realpathSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import type { Root } from '@modelcontextprotocol/sdk/types.js';


describe('getValidRootDirectories', () => {
  let testDir1: string;
  let testDir2: string;
  let testDir3: string;
  let testFile: string;
  beforeEach(() => {
      // Create test directories
      testDir1 = realpathSync(mkdtempSync(join(tmpdir(), 'mcp-roots-test1-')));
      testDir2 = realpathSync(mkdtempSync(join(tmpdir(), 'mcp-roots-test2-')));
      testDir3 = realpathSync(mkdtempSync(join(tmpdir(), 'mcp-roots-test3-')));

      // Create a test file (not a directory)
      testFile = join(testDir1, 'test-file.txt');
      writeFileSync(testFile, 'test content');
    });
  afterEach(() => {
      // Cleanup
      rmSync(testDir1, { recursive: true, force: true });
      rmSync(testDir2, { recursive: true, force: true });
      rmSync(testDir3, { recursive: true, force: true });
    });

  describe('error handling', () => {

    // ── TARGET TEST ─────────────────────────────────
    it('should handle various error types', async () => {
          const nonExistentDir = join(tmpdir(), 'non-existent-directory-12345');
          const invalidPath = '\0invalid\0path'; // Null bytes cause different error types
          const roots = [
            { uri: `file://${testDir1}`, name: 'Valid Dir' },
            { uri: `file://${nonExistentDir}`, name: 'Non-existent Dir' },
            { uri: `file://${testFile}`, name: 'File Not Dir' },
            { uri: `file://${invalidPath}`, name: 'Invalid Path' }
          ];

          const result = await getValidRootDirectories(roots);

          expect(result).toContain(testDir1);
          expect(result).not.toContain(nonExistentDir);
          expect(result).not.toContain(testFile);
          expect(result).not.toContain(invalidPath);
          expect(result).toHaveLength(1);
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});