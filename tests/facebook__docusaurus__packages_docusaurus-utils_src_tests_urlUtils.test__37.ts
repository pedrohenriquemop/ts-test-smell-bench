import {describe, expect, it} from 'vitest';
import {
  normalizeUrl,
  getEditUrl,
  fileToPath,
  isValidPathname,
  resolvePathname,
  encodePath,
  buildSshUrl,
  buildHttpsUrl,
  hasSSHProtocol,
  parseURLPath,
  serializeURLPath,
  parseURLOrPath,
  toURLPath,
  parseLocalURLPath,
} from '../urlUtils';


describe('hasSSHProtocol', () => {

  // ── TARGET TEST ─────────────────────────────────
  it('recognizes explicit SSH protocol', () => {
      const url = 'ssh://git@github.com:422/facebook/docusaurus.git';
      expect(hasSSHProtocol(url)).toBe(true);
    })
  // ── END TARGET TEST ─────────────────────────────
});