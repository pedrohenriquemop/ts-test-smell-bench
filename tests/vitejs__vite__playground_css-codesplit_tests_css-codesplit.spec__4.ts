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
test('should remove empty chunk', async () => {
    expect(findAssetFile(/style-.*\.js$/)).toBeUndefined()
    expect(findAssetFile('main.*.js$')).toMatch(`/* empty css`)
    expect(findAssetFile('other.*.js$')).toMatch(`/* empty css`)
    expect(findAssetFile(/async-[-\w]{8}\.js$/)).toBeUndefined()

    const assets = listAssets()
    expect(assets).not.toContainEqual(
      expect.stringMatching(/async-js-[-\w]{8}\.js$/),
    )
  })
// ── END TARGET TEST ─────────────────────────────