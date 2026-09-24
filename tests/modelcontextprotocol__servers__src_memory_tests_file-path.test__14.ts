import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';
import { ensureMemoryFilePath, defaultMemoryPath, expandHome } from '../index.js';


describe('expandHome', () => {

  // ── TARGET TEST ─────────────────────────────────
  it('leaves relative paths unchanged', () => {
      expect(expandHome(path.join('data', 'memory.jsonl'))).toBe(
        path.join('data', 'memory.jsonl')
      );
    })
  // ── END TARGET TEST ─────────────────────────────
});