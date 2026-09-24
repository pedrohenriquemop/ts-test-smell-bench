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
  it('builds a normal ssh url', () => {
      const url = buildSshUrl('github.com', 'facebook', 'docusaurus');
      expect(url).toBe('git@github.com:facebook/docusaurus.git');
    })
  // ── END TARGET TEST ─────────────────────────────
});