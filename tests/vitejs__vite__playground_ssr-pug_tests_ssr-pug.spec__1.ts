import { describe, expect, test } from 'vitest'
import { page } from '~utils'
import { port } from './serve'

const url = `http://localhost:${port}`

describe('injected inline scripts', () => {

  // ── TARGET TEST ─────────────────────────────────
  test('injected script proxied correctly', async () => {
      await page.goto(url)
      const proxiedScripts = await page.$$eval('script', (nodes) =>
        nodes
          .filter((n) => {
            const src = n.getAttribute('src')
            if (!src) return false
            return src.includes('?html-proxy&index')
          })
          .map((n) => n.getAttribute('src')),
      )

      // assert at least 1 proxied script exists
      expect(proxiedScripts).not.toHaveLength(0)

      const scriptContents = await Promise.all(
        proxiedScripts.map((src) => fetch(url + src).then((res) => res.text())),
      )

      // all proxied scripts return code
      for (const code of scriptContents) {
        expect(code).toBeTruthy()
      }
    })
  // ── END TARGET TEST ─────────────────────────────
});