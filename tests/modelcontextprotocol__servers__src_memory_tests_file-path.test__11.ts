import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';
import { ensureMemoryFilePath, defaultMemoryPath, expandHome } from '../index.js';


describe('expandHome', () => {

  // ── TARGET TEST ─────────────────────────────────
  it('expands a leading "~/" to the home directory', () => {
      expect(expandHome('~/notes/memory.jsonl')).toBe(
        path.join(os.homedir(), 'notes/memory.jsonl')
      );
    })
  // ── END TARGET TEST ─────────────────────────────
});