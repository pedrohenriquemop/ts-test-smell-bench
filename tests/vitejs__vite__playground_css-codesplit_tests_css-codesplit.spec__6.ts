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
test('should generate correct manifest', async () => {
    const manifest = readManifest()
    expect(manifest['index.html'].css.length).toBe(2)
    expect(manifest['other.js'].css.length).toBe(1)
  })
// ── END TARGET TEST ─────────────────────────────