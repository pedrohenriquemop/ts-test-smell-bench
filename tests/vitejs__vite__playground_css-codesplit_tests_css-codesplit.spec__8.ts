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
test('should not mark a css chunk with ?url and normal import as pure css chunk', () => {
    expect(findAssetFile(/chunk-.*\.js$/)).toBeTruthy()
  })
// ── END TARGET TEST ─────────────────────────────