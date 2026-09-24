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
  it('pathname + hash containing a question mark (no query)', () => {
      const url = parseURLOrPath('/pathname#hash?notQuery');
      expect(toURLPath(url)).toEqual({
        pathname: '/pathname',
        search: undefined,
        hash: 'hash?notQuery',
      });
    })
  // ── END TARGET TEST ─────────────────────────────
});