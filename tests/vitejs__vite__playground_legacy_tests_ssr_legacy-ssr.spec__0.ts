import { describe, expect, test } from 'vitest'
import { isBuild, page } from '~utils'
import { port } from './serve'

const url = `http://localhost:${port}`

// ── TARGET TEST ─────────────────────────────────
test('should work', async () => {
    await page.goto(url)
    expect(await page.textContent('#app')).toMatch('Hello')
  })
// ── END TARGET TEST ─────────────────────────────