import { describe, expect, test } from 'vitest'
import { isBuild, isServe, page, readFile, serverLogs } from '~utils'


// ── TARGET TEST ─────────────────────────────────
test('pure annotations are not removed by terser for es', () => {
    const terserEs = readFile('dist/terser/my-lib-custom-filename.js')
    expect(terserEs).toMatch(/[@#]__PURE__/)
  })
// ── END TARGET TEST ─────────────────────────────
test.runIf(isServe)('dev', async () => {
  await expect.poll(() => page.textContent('.demo')).toBe('It works')
})