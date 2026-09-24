import { describe, expect, test } from 'vitest'
import { isBuild, isServe, page, readFile, serverLogs } from '~utils'


// ── TARGET TEST ─────────────────────────────────
test('pure annotations are removed for non-es output', () => {
    const es = readFile('dist/my-lib-custom-filename.iife.js')
    expect(es).not.toMatch(/[@#]__PURE__/)
  })
// ── END TARGET TEST ─────────────────────────────
test.runIf(isServe)('dev', async () => {
  await expect.poll(() => page.textContent('.demo')).toBe('It works')
})