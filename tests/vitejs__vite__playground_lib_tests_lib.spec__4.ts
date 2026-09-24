import { describe, expect, test } from 'vitest'
import { isBuild, isServe, page, readFile, serverLogs } from '~utils'


// ── TARGET TEST ─────────────────────────────────
test('Library mode does not include `preload`', async () => {
    await expect
      .poll(() => page.textContent('.dynamic-import-message'))
      .toMatch('hello vite')
    const code = readFile('dist/lib/dynamic-import-message.es.mjs')
    expect(code).not.toMatch('__vitePreload')

    // Test that library chunks are hashed
    expect(code).toMatch(/await import\(['"`]\.\/message-[-\w]{8}.js['"`]\)/)
  })
// ── END TARGET TEST ─────────────────────────────
test.runIf(isServe)('dev', async () => {
  await expect.poll(() => page.textContent('.demo')).toBe('It works')
})