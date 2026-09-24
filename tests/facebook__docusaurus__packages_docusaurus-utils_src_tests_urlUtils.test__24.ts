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


describe('serializeURLPath', () => {
  function test(input: string, base?: string, expectedOutput?: string) {
      expect(serializeURLPath(parseURLPath(input, base))).toEqual(
        expectedOutput ?? input,
      );
    }

  // ── TARGET TEST ─────────────────────────────────
  it('works for relative paths', () => {
      test('', undefined, '/');
      test('', '/dir1/dir2/page2', '/dir1/dir2/page2');
      test('page', '/dir1/dir2/page2', '/dir1/dir2/page');
      test('../page', '/dir1/dir2/page2', '/dir1/page');
      test('/dir1/dir2/../page', undefined, '/dir1/page');
      test(
        '/dir1/dir2/../page?age=42#anchor',
        undefined,
        '/dir1/page?age=42#anchor',
      );
    })
  // ── END TARGET TEST ─────────────────────────────
});