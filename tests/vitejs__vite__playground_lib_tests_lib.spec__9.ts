import { describe, expect, test } from 'vitest'
import { isBuild, isServe, page, readFile, serverLogs } from '~utils'


// ── TARGET TEST ─────────────────────────────────
test('preserve process.env', () => {
    const es = readFile('dist/my-lib-custom-filename.js')
    const iife = readFile('dist/my-lib-custom-filename.iife.js')
    const umd = readFile('dist/my-lib-custom-filename.umd.cjs')
    expect(es).toMatch('process.env.NODE_ENV')
    expect(iife).toMatch('process.env.NODE_ENV')
    expect(umd).toMatch('process.env.NODE_ENV')
  })
// ── END TARGET TEST ─────────────────────────────
test.runIf(isServe)('dev', async () => {
  await expect.poll(() => page.textContent('.demo')).toBe('It works')
})