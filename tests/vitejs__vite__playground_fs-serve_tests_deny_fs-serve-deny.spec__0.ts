import { describe, expect, test } from 'vitest'
import { isServe, page, viteTestUrl } from '~utils'


// ── TARGET TEST ─────────────────────────────────
test(`**/deny/** should deny ${name}`, async () => {
      const res = await page.request.fetch(new URL(urlPath, viteTestUrl).href)
      expect(res.status()).toBe(403)
    })
// ── END TARGET TEST ─────────────────────────────