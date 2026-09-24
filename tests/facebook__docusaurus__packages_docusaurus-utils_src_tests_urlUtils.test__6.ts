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


describe('toURLPath', () => {

  // ── TARGET TEST ─────────────────────────────────
  it('url', () => {
      const url = new URL('https://example.com/pathname?qs#hash');
      expect(toURLPath(url)).toEqual({
        pathname: '/pathname',
        search: 'qs',
        hash: 'hash',
      });
    })
  // ── END TARGET TEST ─────────────────────────────
});