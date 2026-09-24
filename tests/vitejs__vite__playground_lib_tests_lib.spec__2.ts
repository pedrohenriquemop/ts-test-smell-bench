import { describe, expect, test } from 'vitest'
import { isBuild, isServe, page, readFile, serverLogs } from '~utils'


// ── TARGET TEST ─────────────────────────────────
test('iife', async () => {
    expect(await page.textContent('.iife')).toBe('It works')
    const code = readFile('dist/my-lib-custom-filename.iife.js')
    const noMinifyCode = readFile(
      'dist/nominify/my-lib-custom-filename.iife.js',
    )
    const namedCode = readFile('dist/named/my-lib-named.iife.js')
    // esbuild helpers are injected inside of the IIFE wrapper
    expect(code).toMatch(/^\/\*[^*]*\*\/\s*var MyLib=\(function\(\)\{\s*/)
    expect(noMinifyCode).toMatch(
      /^\/\*[^*]*\*\/\s*var MyLib\s*=\s*\(function\(\)\s*\{\s*/,
    )
    expect(namedCode).toMatch(/^var MyLibNamed=\(function\([^()]+\)\{\s*/)
  })
// ── END TARGET TEST ─────────────────────────────
test.runIf(isServe)('dev', async () => {
  await expect.poll(() => page.textContent('.demo')).toBe('It works')
})