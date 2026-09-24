import { describe, expect, test } from 'vitest'
import {
  findAssetFile,
  getColor,
  isBuild,
  listAssets,
  page,
  readManifest,
} from '~utils'


// ── TARGET TEST ─────────────────────────────────
test('manifest should not reference a deduplicated css file that does not exist', () => {
    const emitted = new Set(listAssets())
    const referenced = Object.values(readManifest())
      .flatMap((chunk) => chunk.css ?? [])
      .map((file) => file.replace(/^assets\//, ''))
    for (const file of referenced) {
      expect(emitted).toContain(file)
    }
  })
// ── END TARGET TEST ─────────────────────────────