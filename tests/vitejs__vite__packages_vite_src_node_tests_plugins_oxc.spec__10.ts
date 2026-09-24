import path from 'node:path'
import { describe, expect, test } from 'vitest'
import { resolveConfig } from '../../config'
import { transformWithOxc } from '../../plugins/oxc'


describe('transformWithOxc', () => {

  // ── TARGET TEST ─────────────────────────────────
  test('uses the configured tsconfig instead of automatic discovery', async () => {
      const code = `
        class Foo {
          bar = 'bar'
        }
      `
      const fixtures = path.resolve(
        import.meta.dirname,
        './fixtures/oxc-tsconfigs',
      )
      const explicitTsconfig = path.resolve(
        fixtures,
        'use-define-false/tsconfig.json',
      )
      const config = await resolveConfig(
        { root: fixtures, tsconfig: explicitTsconfig, configFile: false },
        'serve',
      )
      const expected = await transformWithOxc(
        code,
        path.resolve(fixtures, 'use-define-false/bar.ts'),
        { target: 'esnext' },
      )
      const actual = await transformWithOxc(
        code,
        path.resolve(fixtures, 'use-define-true/bar.ts'),
        { target: 'esnext' },
        undefined,
        config,
      )
      expect(actual.code).toBe(expected.code)
    })
  // ── END TARGET TEST ─────────────────────────────
});