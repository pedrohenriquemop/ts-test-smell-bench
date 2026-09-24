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


describe('resolvePathname', () => {

  // ── TARGET TEST ─────────────────────────────────
  it('works', () => {
      // These tests are directly copied from https://github.com/mjackson/resolve-pathname/blob/master/modules/__tests__/resolvePathname-test.js
      // Maybe we want to wrap that logic in the future?
      expect(resolvePathname('c')).toBe('c');
      expect(resolvePathname('c', 'a/b')).toBe('a/c');
      expect(resolvePathname('/c', '/a/b')).toBe('/c');
      expect(resolvePathname('', '/a/b')).toBe('/a/b');
      expect(resolvePathname('../c', '/a/b')).toBe('/c');
      expect(resolvePathname('c', '/a/b')).toBe('/a/c');
      expect(resolvePathname('c', '/a/')).toBe('/a/c');
      expect(resolvePathname('..', '/a/b')).toBe('/');
    })
  // ── END TARGET TEST ─────────────────────────────
});