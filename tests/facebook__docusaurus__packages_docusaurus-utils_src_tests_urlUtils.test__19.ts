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
  it('parse query string', () => {
      expect(parseURLPath('/page')).toEqual({
        pathname: '/page',
        search: undefined,
        hash: undefined,
      });
      expect(parseURLPath('/page?')).toEqual({
        pathname: '/page',
        search: '',
        hash: undefined,
      });
      expect(parseURLPath('/page?test')).toEqual({
        pathname: '/page',
        search: 'test',
        hash: undefined,
      });
      expect(parseURLPath('/page?age=42&great=true')).toEqual({
        pathname: '/page',
        search: 'age=42&great=true',
        hash: undefined,
      });
    })
  // ── END TARGET TEST ─────────────────────────────
});