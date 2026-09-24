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
  it('parses complex local paths', () => {
      expect(
        parseLocalURLPath('../../great/path name/doc.mdx?age=42#hash'),
      ).toEqual({
        pathname: '../../great/path name/doc.mdx',
        search: 'age=42',
        hash: 'hash',
      });
      expect(parseLocalURLPath('my great path?=42#hash?qsInHash')).toEqual({
        pathname: 'my great path',
        search: '=42',
        hash: 'hash?qsInHash',
      });
      expect(parseLocalURLPath('?qs1#hash1?qs2#hash2')).toEqual({
        pathname: '',
        search: 'qs1',
        hash: 'hash1?qs2#hash2',
      });
      expect(parseLocalURLPath('../swizzling.mdx#wrapping')).toEqual({
        pathname: '../swizzling.mdx',
        search: undefined,
        hash: 'wrapping',
      });
    })
  // ── END TARGET TEST ─────────────────────────────
});