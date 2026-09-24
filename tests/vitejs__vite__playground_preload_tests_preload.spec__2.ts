import { describe, expect, test } from 'vitest'
import { browserLogs, isBuild, page } from '~utils'


// ── TARGET TEST ─────────────────────────────────
test('dynamic import with comments', async () => {
    await page.click('#hello .load')
    await page.waitForSelector('#hello output')

    const html = await page.content()
    expect(html).toMatch(
      /link rel="modulepreload".*?href=".*?\/assets\/hello-[-\w]{8}\.js"/,
    )
    expect(html).toMatch(
      /link rel="stylesheet".*?href=".*?\/assets\/hello-[-\w]{8}\.css"/,
    )
  })
// ── END TARGET TEST ─────────────────────────────