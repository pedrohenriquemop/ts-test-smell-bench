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
  it('pathname + empty qs + empty hash', () => {
      const url = parseURLOrPath('/pathname?#');
      expect(toURLPath(url)).toEqual({
        pathname: '/pathname',
        search: '',
        hash: '',
      });
    })
  // ── END TARGET TEST ─────────────────────────────
});