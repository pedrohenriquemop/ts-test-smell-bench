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

  describe('valid directory processing', () => {

    // ── TARGET TEST ─────────────────────────────────
    it('should process all URI formats and edge cases', async () => {
          const roots = [
            { uri: `file://${testDir1}`, name: 'File URI' },
            { uri: testDir2, name: 'Plain path' },
            { uri: testDir3 } // Plain path without name property
          ];

          const result = await getValidRootDirectories(roots);

          expect(result).toContain(testDir1);
          expect(result).toContain(testDir2);
          expect(result).toContain(testDir3);
          expect(result).toHaveLength(3);
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});