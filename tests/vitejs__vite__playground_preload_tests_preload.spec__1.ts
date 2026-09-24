import { describe, expect, test } from 'vitest'
import { browserLogs, isBuild, page } from '~utils'


// ── TARGET TEST ─────────────────────────────────
test('dynamic import', async () => {
    await page.waitForSelector('#done')
    expect(await page.textContent('#done')).toBe('ran js')
  })
// ── END TARGET TEST ─────────────────────────────