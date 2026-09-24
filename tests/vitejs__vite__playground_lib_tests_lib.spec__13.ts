import { describe, expect, test } from 'vitest'
import { isBuild, isServe, page, readFile, serverLogs } from '~utils'


// ── TARGET TEST ─────────────────────────────────
test('single entry with css', () => {
    const css = readFile('dist/css-single-entry/test-my-lib.css')
    const js = readFile('dist/css-single-entry/test-my-lib.js')
    const umd = readFile('dist/css-single-entry/test-my-lib.umd.cjs')
    expect(css).toMatch('entry-1.css')
    expect(js).toMatch('css-entry-1')
    expect(umd).toContain('css-entry-1')
  })
// ── END TARGET TEST ─────────────────────────────
test.runIf(isServe)('dev', async () => {
  await expect.poll(() => page.textContent('.demo')).toBe('It works')
})