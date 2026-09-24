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


describe('getEditUrl', () => {

  // ── TARGET TEST ─────────────────────────────────
  it('returns right path', () => {
      expect(
        getEditUrl('foo/bar.md', 'https://github.com/facebook/docusaurus'),
      ).toBe('https://github.com/facebook/docusaurus/foo/bar.md');
      expect(
        getEditUrl('foo/你好.md', 'https://github.com/facebook/docusaurus'),
      ).toBe('https://github.com/facebook/docusaurus/foo/你好.md');
    })
  // ── END TARGET TEST ─────────────────────────────
});