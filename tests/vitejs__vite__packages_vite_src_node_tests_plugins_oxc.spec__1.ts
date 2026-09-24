import path from 'node:path'
import { describe, expect, test } from 'vitest'
import { resolveConfig } from '../../config'
import { transformWithOxc } from '../../plugins/oxc'


describe('transformWithOxc', () => {

  // ── TARGET TEST ─────────────────────────────────
  test('correctly overrides TS configuration and preserves code', async () => {
      const foo = 'const foo = () => <></>'
      const result = await transformWithOxc(
        foo,
        path.resolve(
          import.meta.dirname,
          './fixtures/oxc-tsconfigs/jsx-react-jsx/baz.jsx',
        ),
        {
          jsx: 'preserve',
        },
      )
      expect(result?.code).toContain(foo)
    })
  // ── END TARGET TEST ─────────────────────────────
});