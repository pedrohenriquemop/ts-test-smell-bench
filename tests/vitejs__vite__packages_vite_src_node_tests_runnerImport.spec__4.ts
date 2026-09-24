import { resolve } from 'node:path'
import { loadConfigFromFile } from 'vite'
import { describe, expect, test } from 'vitest'
import { slash } from '../../shared/utils'
import { runnerImport } from '../ssr/runnerImport'

const isTypeStrippingSupported = !!process.features.typescript

describe('importing files using inlined environment', () => {
  const fixture = (name: string) =>
      resolve(import.meta.dirname, './fixtures/runner-import', name)

  // ── TARGET TEST ─────────────────────────────────
  test('dynamic import', async () => {
      const { module } = await runnerImport<any>(fixture('dynamic-import.ts'))
      await expect(() => module.default()).rejects.toMatchInlineSnapshot(
        `[Error: Vite module runner has been closed.]`,
      )
      // const dep = await module.default();
      // expect(dep.default).toMatchInlineSnapshot(`"ok"`)
    })
  // ── END TARGET TEST ─────────────────────────────
});