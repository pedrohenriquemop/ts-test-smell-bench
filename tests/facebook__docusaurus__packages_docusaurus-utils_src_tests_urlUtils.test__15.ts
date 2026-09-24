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


describe('parseLocalURLPath', () => {

  // ── TARGET TEST ─────────────────────────────────
  it('parses hash', () => {
      expect(parseLocalURLPath('#')).toEqual({
        pathname: '',
        search: undefined,
        hash: '',
      });
      expect(parseLocalURLPath('#hash')).toEqual({
        pathname: '',
        search: undefined,
        hash: 'hash',
      });
    })
  // ── END TARGET TEST ─────────────────────────────
});