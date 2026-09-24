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


describe('fileToPath', () => {

  // ── TARGET TEST ─────────────────────────────────
  it('works', () => {
      const asserts: {[key: string]: string} = {
        'index.md': '/',
        'hello/index.md': '/hello/',
        'foo.md': '/foo',
        'foo/bar.md': '/foo/bar',
        'index.js': '/',
        'hello/index.js': '/hello/',
        'foo.js': '/foo',
        'foo/bar.js': '/foo/bar',
      };
      Object.keys(asserts).forEach((file) => {
        expect(fileToPath(file)).toBe(asserts[file]);
      });
    })
  // ── END TARGET TEST ─────────────────────────────
});