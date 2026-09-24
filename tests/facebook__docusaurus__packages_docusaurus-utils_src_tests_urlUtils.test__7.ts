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
  it('pathname + qs', () => {
      const url = parseURLOrPath('/pathname?qs');
      expect(toURLPath(url)).toEqual({
        pathname: '/pathname',
        search: 'qs',
        hash: undefined,
      });
    })
  // ── END TARGET TEST ─────────────────────────────
});