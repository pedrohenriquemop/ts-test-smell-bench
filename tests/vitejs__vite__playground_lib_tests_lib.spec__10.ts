import { describe, expect, test } from 'vitest'
import { isBuild, isServe, page, readFile, serverLogs } from '~utils'


// ── TARGET TEST ─────────────────────────────────
test('debugger statements are removed by terser for es', () => {
    const terserEs = readFile('dist/terser/my-lib-custom-filename.js')
    expect(terserEs).not.toMatch('debugger')
  })
// ── END TARGET TEST ─────────────────────────────
test.runIf(isServe)('dev', async () => {
  await expect.poll(() => page.textContent('.demo')).toBe('It works')
})