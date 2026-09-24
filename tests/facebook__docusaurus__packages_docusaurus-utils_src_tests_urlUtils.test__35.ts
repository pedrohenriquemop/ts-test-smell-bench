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


describe('buildHttpsUrl', () => {

  // ── TARGET TEST ─────────────────────────────────
  it('builds a normal http url', () => {
      const url = buildHttpsUrl(
        'user:pass',
        'github.com',
        'facebook',
        'docusaurus',
      );
      expect(url).toBe('https://user:pass@github.com/facebook/docusaurus.git');
    })
  // ── END TARGET TEST ─────────────────────────────
});