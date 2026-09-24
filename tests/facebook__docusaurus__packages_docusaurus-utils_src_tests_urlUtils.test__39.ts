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
  it('does not recognize HTTPS with credentials', () => {
      const url = 'https://user:pass@github.com/facebook/docusaurus.git';
      expect(hasSSHProtocol(url)).toBe(false);
    })
  // ── END TARGET TEST ─────────────────────────────
});