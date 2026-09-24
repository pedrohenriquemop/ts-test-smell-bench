import { describe, it, expect } from 'vitest';
import { createRequire } from 'node:module';
import path from 'path';
import { fileURLToPath } from 'url';
import { resolvePackageVersion, SERVER_VERSION } from '../version.js';

const packageJson = createRequire(import.meta.url)('../package.json') as { version: string };

describe('server version', () => {

  // ── TARGET TEST ─────────────────────────────────
  it('uses package.json version for serverInfo', () => {
      expect(SERVER_VERSION).toBe(packageJson.version);
      expect(resolvePackageVersion()).toBe(packageJson.version);
    })
  // ── END TARGET TEST ─────────────────────────────
});