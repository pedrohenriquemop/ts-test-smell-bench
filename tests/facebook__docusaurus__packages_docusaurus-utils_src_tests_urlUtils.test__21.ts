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


describe('parseURLPath', () => {

  // ── TARGET TEST ─────────────────────────────────
  it('parse hash', () => {
      expect(parseURLPath('/page')).toEqual({
        pathname: '/page',
        search: undefined,
        hash: undefined,
      });
      expect(parseURLPath('/page#')).toEqual({
        pathname: '/page',
        search: undefined,
        hash: '',
      });
      expect(parseURLPath('/page#anchor')).toEqual({
        pathname: '/page',
        search: undefined,
        hash: 'anchor',
      });
    })
  // ── END TARGET TEST ─────────────────────────────
});