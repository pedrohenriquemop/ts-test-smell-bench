import { describe, expect, test } from 'vitest'
import { findAssetFile, isBuild, page } from '~utils'


describe('syntax is lowered', () => {

  // ── TARGET TEST ─────────────────────────────────
  test('private field', async () => {
      await expect.poll(() => page.textContent('.private-field')).toBe('private')

      if (isBuild) {
        const content = findAssetFile(/index-[-\w]{8}\.js/)
        expect(content).not.toMatch(/this\.#\w+/)
      }
    })
  // ── END TARGET TEST ─────────────────────────────
});