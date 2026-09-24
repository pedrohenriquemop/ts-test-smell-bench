import { describe, expect, test } from 'vitest'
import { isBuild, page } from '~utils'
import { port } from './serve'

const url = `http://localhost:${port}`

// ── TARGET TEST ─────────────────────────────────
test('import.meta.env.LEGACY', async () => {
    // SSR build is always modern
    expect(await page.textContent('#env')).toMatch('false')
  })
// ── END TARGET TEST ─────────────────────────────