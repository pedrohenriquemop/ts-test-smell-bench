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
test('should remove empty chunk, HTML without JS', async () => {
    const sharedCSSWithJSChunk = findAssetFile('shared-css-with-js.*.js$')
    expect(sharedCSSWithJSChunk).toMatch(`/* empty css`)
    // there are functions and modules in the src code that should be tree-shaken
    expect(sharedCSSWithJSChunk).not.toMatch('function')
    expect(sharedCSSWithJSChunk).not.toMatch(/import(?!\s*".\/modulepreload)/)
  })
// ── END TARGET TEST ─────────────────────────────