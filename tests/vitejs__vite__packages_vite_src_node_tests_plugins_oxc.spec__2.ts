import path from 'node:path'
import { describe, expect, test } from 'vitest'
import { resolveConfig } from '../../config'
import { transformWithOxc } from '../../plugins/oxc'


describe('transformWithOxc', () => {

  // ── TARGET TEST ─────────────────────────────────
  test('correctly overrides TS configuration and transforms code', async () => {
      const jsxFactory = 'h',
        jsxFragment = 'bar'
      const result = await transformWithOxc(
        'const foo = () => <></>',
        path.resolve(
          import.meta.dirname,
          './fixtures/oxc-tsconfigs/jsx-complex-options/baz.jsx',
        ),
        {
          jsx: {
            runtime: 'classic',
            pragma: jsxFactory,
            pragmaFrag: jsxFragment,
          },
        },
      )
      expect(result?.code).toContain(
        `/* @__PURE__ */ ${jsxFactory}(${jsxFragment}, null)`,
      )
    })
  // ── END TARGET TEST ─────────────────────────────
});