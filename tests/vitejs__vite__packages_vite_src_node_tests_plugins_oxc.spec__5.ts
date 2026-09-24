import path from 'node:path'
import { describe, expect, test } from 'vitest'
import { resolveConfig } from '../../config'
import { transformWithOxc } from '../../plugins/oxc'


describe('transformWithOxc', () => {

  describe('useDefineForClassFields', () => {
    const transformClassCode = async (target: string, tsconfigDir: string) => {
          const result = await transformWithOxc(
            `
              class foo {
                bar = 'bar'
              }
            `,
            path.resolve(import.meta.dirname, tsconfigDir, './bar.ts'),
            { target },
          )
          return result?.code
        }
    const [
          defineForClassFieldsTrueTransformedCode,
          defineForClassFieldsTrueLowerTransformedCode,
          defineForClassFieldsFalseTransformedCode,
        ] = await Promise.all([
          transformClassCode('esnext', './fixtures/oxc-tsconfigs/use-define-true'),
          transformClassCode('es2021', './fixtures/oxc-tsconfigs/use-define-true'),
          transformClassCode('esnext', './fixtures/oxc-tsconfigs/use-define-false'),
        ])

    // ── TARGET TEST ─────────────────────────────────
    test('target: es2021 and tsconfig.target: es2021 => false', async () => {
          const actual = await transformClassCode(
            'es2021',
            './fixtures/oxc-tsconfigs/target-es2021',
          )
          expect(actual).toBe(defineForClassFieldsFalseTransformedCode)
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});