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
  it('parses qs', () => {
      expect(parseLocalURLPath('?')).toEqual({
        pathname: '',
        search: '',
        hash: undefined,
      });
      expect(parseLocalURLPath('?qs')).toEqual({
        pathname: '',
        search: 'qs',
        hash: undefined,
      });
      expect(parseLocalURLPath('?age=42')).toEqual({
        pathname: '',
        search: 'age=42',
        hash: undefined,
      });
    })
  // ── END TARGET TEST ─────────────────────────────
});