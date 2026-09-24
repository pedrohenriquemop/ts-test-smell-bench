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
  it('returns null for non-local URLs', () => {
      expect(parseLocalURLPath('https://example')).toBeNull();
      expect(parseLocalURLPath('https://example:80')).toBeNull();
      expect(parseLocalURLPath('https://example.com/xyz')).toBeNull();
      expect(parseLocalURLPath('https://example.com/xyz?qs#hash')).toBeNull();
      expect(parseLocalURLPath('https://example.com:80/xyz?qs#hash')).toBeNull();
      expect(parseLocalURLPath('https://u:p@example:80/xyz?qs#hash')).toBeNull();
    })
  // ── END TARGET TEST ─────────────────────────────
});