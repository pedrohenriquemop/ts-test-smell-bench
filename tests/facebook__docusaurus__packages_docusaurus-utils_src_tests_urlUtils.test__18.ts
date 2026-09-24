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
  it('parse and resolve pathname', () => {
      expect(parseURLPath('')).toEqual({
        pathname: '/',
        search: undefined,
        hash: undefined,
      });
      expect(parseURLPath('/')).toEqual({
        pathname: '/',
        search: undefined,
        hash: undefined,
      });
      expect(parseURLPath('/page')).toEqual({
        pathname: '/page',
        search: undefined,
        hash: undefined,
      });
      expect(parseURLPath('/dir1/page')).toEqual({
        pathname: '/dir1/page',
        search: undefined,
        hash: undefined,
      });
      expect(parseURLPath('/dir1/dir2/./../page')).toEqual({
        pathname: '/dir1/page',
        search: undefined,
        hash: undefined,
      });
      expect(parseURLPath('/dir1/dir2/../..')).toEqual({
        pathname: '/',
        search: undefined,
        hash: undefined,
      });
      expect(parseURLPath('/dir1/dir2/../../..')).toEqual({
        pathname: '/',
        search: undefined,
        hash: undefined,
      });
      expect(parseURLPath('./dir1/dir2./../page', '/dir3/dir4/page2')).toEqual({
        pathname: '/dir3/dir4/dir1/page',
        search: undefined,
        hash: undefined,
      });
    })
  // ── END TARGET TEST ─────────────────────────────
});