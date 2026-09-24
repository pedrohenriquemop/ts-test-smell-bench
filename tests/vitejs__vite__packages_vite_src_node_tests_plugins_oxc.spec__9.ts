import path from 'node:path'
import { describe, expect, test } from 'vitest'
import { resolveConfig } from '../../config'
import { transformWithOxc } from '../../plugins/oxc'


describe('transformWithOxc', () => {

  // ── TARGET TEST ─────────────────────────────────
  test('supports emitDecoratorMetadata: true', async () => {
      const result = await transformWithOxc(
        `
            function LogMethod(target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
              console.log(target, propertyKey, descriptor);
            }

            class Demo {
              @LogMethod
              public foo(bar: number) {}
            }

            const demo = new Demo();
          `,
        path.resolve(
          import.meta.dirname,
          './fixtures/oxc-tsconfigs/decorator-metadata/bar.ts',
        ),
      )
      expect(result?.code).toContain('_decorateMetadata("design:type"')
    })
  // ── END TARGET TEST ─────────────────────────────
});