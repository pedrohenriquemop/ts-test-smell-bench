import path from 'node:path'
import { describe, expect, test } from 'vitest'
import { resolveConfig } from '../../config'
import { transformWithOxc } from '../../plugins/oxc'


describe('transformWithOxc', () => {

  // ── TARGET TEST ─────────────────────────────────
  test('correctly overrides TS configuration and applies automatic transform', async () => {
      const jsxImportSource = 'bar'
      const result = await transformWithOxc(
        'const foo = () => <></>',
        path.resolve(
          import.meta.dirname,
          './fixtures/oxc-tsconfigs/jsx-preserve/baz.jsx',
        ),
        {
          jsx: {
            runtime: 'automatic',
            importSource: jsxImportSource,
          },
        },
      )
      expect(result?.code).toContain(`${jsxImportSource}/jsx-runtime`)
      expect(result?.code).toContain('/* @__PURE__ */')
    })
  // ── END TARGET TEST ─────────────────────────────
});