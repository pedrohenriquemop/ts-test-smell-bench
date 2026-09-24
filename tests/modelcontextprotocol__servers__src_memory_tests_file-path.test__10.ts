import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';
import { ensureMemoryFilePath, defaultMemoryPath, expandHome } from '../index.js';


describe('expandHome', () => {

  // ── TARGET TEST ─────────────────────────────────
  it('expands a bare "~" to the home directory', () => {
      expect(expandHome('~')).toBe(os.homedir());
    })
  // ── END TARGET TEST ─────────────────────────────
});