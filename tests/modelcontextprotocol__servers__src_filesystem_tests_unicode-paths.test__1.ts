import fs from 'fs/promises';
import os from 'os';
import path from 'path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { setAllowedDirectories, validatePath } from '../lib.js';


describe('Unicode-equivalent filesystem paths', () => {
  let testDirectory: string;
  beforeEach(async () => {
      testDirectory = await fs.mkdtemp(path.join(os.tmpdir(), 'mcp-unicode-paths-'));
      setAllowedDirectories([testDirectory]);
    });
  afterEach(async () => {
      setAllowedDirectories([]);
      await fs.rm(testDirectory, { recursive: true, force: true });
    });

  // ── TARGET TEST ─────────────────────────────────
  it('preserves a new basename after resolving a Unicode-equivalent parent', async () => {
      const onDiskDirectory = 'de\u0301marche';
      await fs.mkdir(path.join(testDirectory, onDiskDirectory));

      const resolved = await validatePath(path.join(testDirectory, 'd\u00e9marche', 'new.txt'));

      expect(resolved).toBe(path.join(await fs.realpath(path.join(testDirectory, onDiskDirectory)), 'new.txt'));
    })
  // ── END TARGET TEST ─────────────────────────────
});