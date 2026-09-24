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
  it('parses pathname', () => {
      expect(parseLocalURLPath('/pathname')).toEqual({
        pathname: '/pathname',
        search: undefined,
        hash: undefined,
      });
      expect(parseLocalURLPath('pathname.md')).toEqual({
        pathname: 'pathname.md',
        search: undefined,
        hash: undefined,
      });
      expect(parseLocalURLPath('./pathname')).toEqual({
        pathname: './pathname',
        search: undefined,
        hash: undefined,
      });
      expect(parseLocalURLPath('../../pathname.mdx')).toEqual({
        pathname: '../../pathname.mdx',
        search: undefined,
        hash: undefined,
      });
    })
  // ── END TARGET TEST ─────────────────────────────
});