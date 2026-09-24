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


describe('isValidPathname', () => {

  // ── TARGET TEST ─────────────────────────────────
  it('works', () => {
      expect(isValidPathname('/')).toBe(true);
      expect(isValidPathname('/hey')).toBe(true);
      expect(isValidPathname('/hey/ho')).toBe(true);
      expect(isValidPathname('/hey/ho/')).toBe(true);
      expect(isValidPathname('/hey/h%C3%B4/')).toBe(true);
      expect(isValidPathname('/hey///ho///')).toBe(true); // Unexpected but valid
      expect(isValidPathname('/hey/héllô you')).toBe(true);

      expect(isValidPathname('')).toBe(false);
      expect(isValidPathname('hey')).toBe(false);
      expect(isValidPathname('/hey?qs=ho')).toBe(false);
      expect(isValidPathname('https://fb.com/hey')).toBe(false);
      expect(isValidPathname('//hey')).toBe(false);
      expect(isValidPathname('////')).toBe(false);
    })
  // ── END TARGET TEST ─────────────────────────────
});