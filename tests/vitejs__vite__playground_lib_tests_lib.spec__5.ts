import { describe, expect, test } from 'vitest'
import { isBuild, isServe, page, readFile, serverLogs } from '~utils'


// ── TARGET TEST ─────────────────────────────────
test('Library mode does not have any reference to pure CSS chunks', async () => {
    const code = readFile('dist/lib/dynamic-import-message.es.mjs')

    // Does not import pure CSS chunks and replaced by `Promise.resolve({})` instead
    expect(code).not.toMatch(
      /await import\(['"`]\.\/dynamic-[-\w]{8}.js['"`]\)/,
    )
    expect(code).toMatch(/await Promise.resolve\(\{.*\}\)/)
  })
// ── END TARGET TEST ─────────────────────────────
test.runIf(isServe)('dev', async () => {
  await expect.poll(() => page.textContent('.demo')).toBe('It works')
})