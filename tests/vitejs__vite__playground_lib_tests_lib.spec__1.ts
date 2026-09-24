import { describe, expect, test } from 'vitest'
import { isBuild, isServe, page, readFile, serverLogs } from '~utils'


// ── TARGET TEST ─────────────────────────────────
test('umd', async () => {
    expect(await page.textContent('.umd')).toBe('It works')
    const code = readFile('dist/my-lib-custom-filename.umd.cjs')
    const noMinifyCode = readFile(
      'dist/nominify/my-lib-custom-filename.umd.cjs',
    )
    const namedCode = readFile('dist/named/my-lib-named.umd.cjs')
    // esbuild helpers are injected inside of the UMD wrapper
    expect(code).toMatch(/^\/\*[^*]*\*\/\s*\(function\(/)
    expect(noMinifyCode).toMatch(
      /^\/\*[^*]*\*\/\s*\(function\(global.+?function\smyLib\(/s,
    )
    expect(namedCode).toMatch(/^\(function\(/)
  })
// ── END TARGET TEST ─────────────────────────────
test.runIf(isServe)('dev', async () => {
  await expect.poll(() => page.textContent('.demo')).toBe('It works')
})