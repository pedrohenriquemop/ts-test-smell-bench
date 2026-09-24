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
  it('resolves an existing decomposed path from a composed request', async () => {
      const onDiskDirectory = 'de\u0301marche';
      const onDiskFile = 're\u0301sume\u0301.txt';
      await fs.mkdir(path.join(testDirectory, onDiskDirectory));
      await fs.writeFile(path.join(testDirectory, onDiskDirectory, onDiskFile), 'content');

      const resolved = await validatePath(path.join(testDirectory, 'd\u00e9marche', 'r\u00e9sum\u00e9.txt'));

      expect(resolved).toBe(await fs.realpath(path.join(testDirectory, onDiskDirectory, onDiskFile)));
    })
  // ── END TARGET TEST ─────────────────────────────
});