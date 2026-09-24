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


describe('getEditUrl', () => {

  // ── TARGET TEST ─────────────────────────────────
  it('returns undefined for undefined', () => {
      expect(getEditUrl('foo/bar.md')).toBeUndefined();
    })
  // ── END TARGET TEST ─────────────────────────────
});