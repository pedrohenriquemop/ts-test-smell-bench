import {describe, expect, it} from 'vitest';
import {siteNameToPackageName} from '../utils';


describe('siteNameToPackageName', () => {

  // ── TARGET TEST ─────────────────────────────────
  it('converts simple cases', () => {
      const testCases: [string, string][] = [
        ['Foo Bar', 'foo-bar'],
        ['fooBar', 'foo-bar'],
        ['__FOO_BAR__', 'foo-bar'],
        ['XMLHttpRequest', 'xml-http-request'],
        ['sitemapXML', 'sitemap-xml'],
        ['XMLHttp', 'xml-http'],
        ['xml-http', 'xml-http'],
      ];

      testCases.forEach(([input, expected]) => {
        expect(siteNameToPackageName(input)).toEqual(expected);
      });
    })
  // ── END TARGET TEST ─────────────────────────────
});