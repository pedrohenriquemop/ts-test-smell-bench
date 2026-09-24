import { describe, expect, test } from 'vitest'
import { isBuild, isServe, page, readFile, serverLogs } from '~utils'


// ── TARGET TEST ─────────────────────────────────
test('@import hoist', async () => {
    serverLogs.forEach((log) => {
      // no warning from esbuild css minifier
      expect(log).not.toMatch('All "@import" rules must come first')
    })
  })
// ── END TARGET TEST ─────────────────────────────
test.runIf(isServe)('dev', async () => {
  await expect.poll(() => page.textContent('.demo')).toBe('It works')
})