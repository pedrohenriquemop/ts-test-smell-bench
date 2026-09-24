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


describe('buildSshUrl', () => {

  // ── TARGET TEST ─────────────────────────────────
  it('builds a ssh url with port', () => {
      const url = buildSshUrl('github.com', 'facebook', 'docusaurus', '422');
      expect(url).toBe('ssh://git@github.com:422/facebook/docusaurus.git');
    })
  // ── END TARGET TEST ─────────────────────────────
});