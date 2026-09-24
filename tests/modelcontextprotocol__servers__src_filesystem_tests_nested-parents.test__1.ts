import fs from 'fs/promises';
import os from 'os';
import path from 'path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { setAllowedDirectories, validatePath } from '../lib.js';


describe('validatePath with multiple missing ancestors', () => {
  let allowedDir: string;
  let outsideDir: string;
  beforeEach(async () => {
      allowedDir = await fs.realpath(await fs.mkdtemp(path.join(os.tmpdir(), 'mcp-nested-allowed-')));
      outsideDir = await fs.realpath(await fs.mkdtemp(path.join(os.tmpdir(), 'mcp-nested-outside-')));
      setAllowedDirectories([allowedDir]);
    });
  afterEach(async () => {
      setAllowedDirectories([]);
      await fs.rm(allowedDir, { recursive: true, force: true });
      await fs.rm(outsideDir, { recursive: true, force: true });
    });

  // ── TARGET TEST ─────────────────────────────────
  it('rejects when the nearest existing ancestor is a symlink out of the allowed tree', async () => {
      await fs.symlink(outsideDir, path.join(allowedDir, 'link'), 'junction');
      await expect(validatePath(path.join(allowedDir, 'link', 'a', 'b')))
        .rejects.toThrow('Access denied');
    })
  // ── END TARGET TEST ─────────────────────────────
});