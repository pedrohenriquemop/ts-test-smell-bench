import { describe, expect, test } from 'vitest'
import { assetImportMetaUrlRE } from '../plugins/assetImportMetaUrl'
import { workerImportMetaUrlRE } from '../plugins/workerImportMetaUrl'


describe('filter regexes do not cause catastrophic backtracking', () => {
  const largeCode =
      `new URL('https://example.com');\n`.repeat(200) +
      `var a = 1;\n`.repeat(200_000)

  // ── TARGET TEST ─────────────────────────────────
  test('assetImportMetaUrlRE still matches valid patterns', () => {
      assetImportMetaUrlRE.lastIndex = 0
      expect(
        assetImportMetaUrlRE.test(`new URL('./asset.png', import.meta.url)`),
      ).toBe(true)
    })
  // ── END TARGET TEST ─────────────────────────────
});