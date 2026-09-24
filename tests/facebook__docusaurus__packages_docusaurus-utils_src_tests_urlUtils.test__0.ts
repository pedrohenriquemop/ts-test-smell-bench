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


describe('normalizeUrl', () => {

  // ── TARGET TEST ─────────────────────────────────
  it('normalizes urls correctly', () => {
      const asserts = [
        {
          input: [],
          output: '',
        },
        {
          input: ['/', ''],
          output: '/',
        },
        {
          input: ['', '/'],
          output: '/',
        },
        {
          input: ['/'],
          output: '/',
        },
        {
          input: [''],
          output: '',
        },
        {
          input: ['/', '/'],
          output: '/',
        },
        {
          input: ['/', 'docs'],
          output: '/docs',
        },
        {
          input: ['/', 'docs', 'en', 'next', 'blog'],
          output: '/docs/en/next/blog',
        },
        {
          input: ['/test/', '/docs', 'ro', 'doc1'],
          output: '/test/docs/ro/doc1',
        },
        {
          input: ['/test/', '/', 'ro', 'doc1'],
          output: '/test/ro/doc1',
        },
        {
          input: ['/', '/', '2020/02/29/leap-day'],
          output: '/2020/02/29/leap-day',
        },
        {
          input: ['', '/', 'ko', 'hello'],
          output: '/ko/hello',
        },
        {
          input: ['hello', 'world'],
          output: 'hello/world',
        },
        {
          input: ['http://www.google.com/', 'foo/bar', '?test=123'],
          output: 'http://www.google.com/foo/bar?test=123',
        },
        {
          input: ['http:', 'www.google.com///', 'foo/bar', '?test=123'],
          output: 'http://www.google.com/foo/bar?test=123',
        },
        {
          input: ['http://foobar.com', '', 'test'],
          output: 'http://foobar.com/test',
        },
        {
          input: ['http://foobar.com', '', 'test', '/'],
          output: 'http://foobar.com/test/',
        },
        {
          input: ['http://foobar.com/', '', 'test', '/'],
          output: 'http://foobar.com/test/',
        },
        {
          input: ['http://foobar.com', '#', 'test'],
          output: 'http://foobar.com/#/test',
        },
        {
          input: ['http://foobar.com/', '#', 'test'],
          output: 'http://foobar.com/#/test',
        },
        {
          input: ['http://foobar.com', '/#/', 'test'],
          output: 'http://foobar.com/#/test',
        },
        {
          input: ['http://foobar.com', '#/', 'test'],
          output: 'http://foobar.com/#/test',
        },
        {
          input: ['http://foobar.com', '/#', 'test'],
          output: 'http://foobar.com/#/test',
        },
        {
          input: ['/', '', 'hello', '', '/', '/', '', '/', '/world'],
          output: '/hello/world',
        },
        {
          input: ['', '', '/tt', 'ko', 'hello'],
          output: '/tt/ko/hello',
        },
        {
          input: ['', '///hello///', '', '///world'],
          output: '/hello/world',
        },
        {
          input: ['', '/hello/', ''],
          output: '/hello/',
        },
        {
          input: ['', '/', ''],
          output: '/',
        },
        {
          input: ['///', '///'],
          output: '/',
        },
        {
          input: ['/', '/hello/world/', '///'],
          output: '/hello/world/',
        },
        {
          input: ['file://', '//hello/world/'],
          output: 'file:///hello/world/',
        },
        {
          input: ['file:', '/hello/world/'],
          output: 'file:///hello/world/',
        },
        {
          input: ['file://', '/hello/world/'],
          output: 'file:///hello/world/',
        },
        {
          input: ['file:', 'hello/world/'],
          output: 'file://hello/world/',
        },
      ];
      asserts.forEach((testCase) => {
        expect(normalizeUrl(testCase.input)).toBe(testCase.output);
      });

      expect(() =>
        // @ts-expect-error undefined for test
        normalizeUrl(['http:example.com', undefined]),
      ).toThrowErrorMatchingInlineSnapshot(
        `[TypeError: Url must be a string. Received undefined]`,
      );
    })
  // ── END TARGET TEST ─────────────────────────────
});