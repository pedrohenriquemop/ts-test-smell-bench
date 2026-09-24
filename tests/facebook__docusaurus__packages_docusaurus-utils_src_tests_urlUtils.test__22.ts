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
  it('parse fancy real-world edge cases', () => {
      expect(parseURLPath('/page?#')).toEqual({
        pathname: '/page',
        search: '',
        hash: '',
      });
      expect(
        parseURLPath('dir1/dir2/../page?age=42#anchor', '/dir3/page2'),
      ).toEqual({
        pathname: '/dir3/dir1/page',
        search: 'age=42',
        hash: 'anchor',
      });
    })
  // ── END TARGET TEST ─────────────────────────────
});