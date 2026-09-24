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


describe('encodePath', () => {

  // ── TARGET TEST ─────────────────────────────────
  it('works', () => {
      expect(encodePath('a/foo/')).toBe('a/foo/');
      // cSpell:ignore cfoo
      expect(encodePath('a/<foo>/')).toBe('a/%3Cfoo%3E/');
      expect(encodePath('a/你好/')).toBe('a/%E4%BD%A0%E5%A5%BD/');
    })
  // ── END TARGET TEST ─────────────────────────────
});