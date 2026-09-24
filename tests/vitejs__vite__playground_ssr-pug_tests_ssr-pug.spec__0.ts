import { describe, expect, test } from 'vitest'
import { page } from '~utils'
import { port } from './serve'

const url = `http://localhost:${port}`

describe('injected inline scripts', () => {

  // ── TARGET TEST ─────────────────────────────────
  test('no injected inline scripts are present', async () => {
      await page.goto(url)
      const inlineScripts = await page.$$eval('script', (nodes) =>
        nodes.filter((n) => !n.getAttribute('src') && n.innerHTML),
      )
      expect(inlineScripts).toHaveLength(0)
    })
  // ── END TARGET TEST ─────────────────────────────
});