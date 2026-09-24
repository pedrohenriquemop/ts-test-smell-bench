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
  it('parse anchor', () => {
      expect(parseURLPath('#anchor')).toEqual({
        pathname: '/',
        search: undefined,
        hash: 'anchor',
      });
      expect(parseURLPath('#anchor', '/page')).toEqual({
        pathname: '/page',
        search: undefined,
        hash: 'anchor',
      });
      expect(parseURLPath('#')).toEqual({
        pathname: '/',
        search: undefined,
        hash: '',
      });
      expect(parseURLPath('#', '/page')).toEqual({
        pathname: '/page',
        search: undefined,
        hash: '',
      });
    })
  // ── END TARGET TEST ─────────────────────────────
});