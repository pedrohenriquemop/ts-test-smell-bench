import { describe, expect, test } from 'vitest'
import { isBuild, isServe, page, readFile, serverLogs } from '~utils'


// ── TARGET TEST ─────────────────────────────────
test('restrisct-helpers-injection', async () => {
    const code = readFile(
      'dist/helpers-injection/my-lib-custom-filename.iife.js',
    )
    expect(code).toMatch(
      `\\"use strict\\"; return (" + expressionSyntax + ").constructor;"`,
    )
  })
// ── END TARGET TEST ─────────────────────────────
test.runIf(isServe)('dev', async () => {
  await expect.poll(() => page.textContent('.demo')).toBe('It works')
})