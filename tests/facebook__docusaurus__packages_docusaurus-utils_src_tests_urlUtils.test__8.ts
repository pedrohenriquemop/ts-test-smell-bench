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
  it('pathname + hash', () => {
      const url = parseURLOrPath('/pathname#hash');
      expect(toURLPath(url)).toEqual({
        pathname: '/pathname',
        search: undefined,
        hash: 'hash',
      });
    })
  // ── END TARGET TEST ─────────────────────────────
});