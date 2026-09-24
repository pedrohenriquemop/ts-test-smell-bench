import type { ecmaVersion } from 'acorn'
import { parse } from 'acorn'
import { describe, expect, test } from 'vitest'
import {
  createModernChunkLegacyGuard,
  detectModernBrowserCode,
  detectModernBrowserDetector,
  dynamicFallbackInlineCode,
  safari10NoModuleFix,
  systemJSInlineCode,
} from '../snippets'

const shouldFailVersions: ecmaVersion[] = []
for (let v = 2015; v <= 2019; v++) {
  shouldFailVersions.push(v as ecmaVersion)
}
const shouldPassVersions: ecmaVersion[] = []
for (let v = 2020; v <= 2024; v++) {
  shouldPassVersions.push(v as ecmaVersion)
}
for (const version of shouldFailVersions) {
  test(`detect code should not be able to be parsed with ES${version}`, () => {
    expect(() => {
      parse(detectModernBrowserDetector, {
        ecmaVersion: version,
        sourceType: 'module',
      })
    }).toThrow()
  })
}
for (const version of shouldPassVersions) {
  test(`detect code should be able to be parsed with ES${version}`, () => {
    expect(() => {
      parse(detectModernBrowserDetector, {
        ecmaVersion: version,
        sourceType: 'module',
      })
    }).not.toThrow()
  })
}

describe('createModernChunkLegacyGuard', () => {

  // ── TARGET TEST ─────────────────────────────────
  test('generates unique data URLs for different chunk filenames', () => {
      const guard1 = createModernChunkLegacyGuard('assets/index-abc123.js')
      const guard2 = createModernChunkLegacyGuard('assets/chunk-def456.js')
      expect(guard1).not.toBe(guard2)
    })
  // ── END TARGET TEST ─────────────────────────────
});