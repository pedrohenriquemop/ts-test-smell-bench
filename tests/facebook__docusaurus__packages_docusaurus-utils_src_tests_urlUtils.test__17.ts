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
  it('parses is isomorphic with serialize', () => {
      const testLocalPath = (url: string) => {
        expect(serializeURLPath(parseLocalURLPath(url)!)).toBe(url);
      };
      [
        '',
        'doc',
        'doc.mdx',
        './doc.mdx',
        '.././doc.mdx',
        '/some pathname/.././doc.mdx',
        '?',
        '?qs',
        '#',
        '#hash',
        '?qs#hash',
        '?qs#hash',
        'doc.mdx?qs#hash',
        '/some pathname/.././doc.mdx?qs#hash',
        '/some pathname/.././doc.mdx?qs#hash?qs2#hash2',
      ].forEach(testLocalPath);
    })
  // ── END TARGET TEST ─────────────────────────────
});