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
  it('rejects ambiguous canonically equivalent entries', async () => {
      const composed = 'caf\u00e9';
      const decomposed = 'cafe\u0301';
      await fs.mkdir(path.join(testDirectory, composed));
      await fs.mkdir(path.join(testDirectory, decomposed));

      await expect(validatePath(path.join(testDirectory, 'cafe\u0341', 'file.txt')))
        .rejects.toThrow('Ambiguous Unicode path component');
    })
  // ── END TARGET TEST ─────────────────────────────
});