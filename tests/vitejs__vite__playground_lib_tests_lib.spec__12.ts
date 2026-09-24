import { describe, expect, test } from 'vitest'
import { isBuild, isServe, page, readFile, serverLogs } from '~utils'


// ── TARGET TEST ─────────────────────────────────
test('pure annotations are removed by terser for non-es output', () => {
    const terserIife = readFile('dist/terser/my-lib-custom-filename.iife.js')
    expect(terserIife).not.toMatch(/[@#]__PURE__/)
  })
// ── END TARGET TEST ─────────────────────────────
test.runIf(isServe)('dev', async () => {
  await expect.poll(() => page.textContent('.demo')).toBe('It works')
})