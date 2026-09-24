import net from 'node:net'
import path from 'node:path'
import { describe, expect, test } from 'vitest'
import { isServe, isWindows, viteTestUrl } from '~utils'
import './commonTests'


// ── TARGET TEST ─────────────────────────────────
test(name, async () => {
      const response = await sendRawRequest(viteTestUrl, target)
      expect(response).toContain(status)
      if (content !== undefined) {
        expect(response).toContain(content)
      }
    })
// ── END TARGET TEST ─────────────────────────────