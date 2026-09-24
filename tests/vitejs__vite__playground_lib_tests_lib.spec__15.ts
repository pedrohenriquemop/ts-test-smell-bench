import { describe, expect, test } from 'vitest'
import { isBuild, isServe, page, readFile, serverLogs } from '~utils'


// ── TARGET TEST ─────────────────────────────────
test('multi entry with css and code split', () => {
    const css1 = readFile('dist/css-code-split/css-entry-1.css')
    const css2 = readFile('dist/css-code-split/css-entry-2.css')
    const js1 = readFile('dist/css-code-split/css-entry-1.js')
    const js2 = readFile('dist/css-code-split/css-entry-2.js')
    const cjs1 = readFile('dist/css-code-split/css-entry-1.cjs')
    const cjs2 = readFile('dist/css-code-split/css-entry-2.cjs')
    expect(css1).toMatch('entry-1.css')
    expect(css2).toMatch('entry-2.css')
    expect(js1).toMatch('css-entry-1')
    expect(js2).toMatch('css-entry-2')
    expect(cjs1).toContain('css-entry-1')
    expect(cjs2).toContain('css-entry-2')
  })
// ── END TARGET TEST ─────────────────────────────
test.runIf(isServe)('dev', async () => {
  await expect.poll(() => page.textContent('.demo')).toBe('It works')
})