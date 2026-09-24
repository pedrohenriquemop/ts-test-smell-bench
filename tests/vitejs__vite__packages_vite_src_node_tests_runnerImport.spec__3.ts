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
  test('can import vite config that imports a TS external module', async () => {
      const { module, dependencies } = await runnerImport<
        typeof import('./fixtures/runner-import/vite.config.outside-pkg-import.mjs')
      >(fixture('vite.config.outside-pkg-import.mts'))

      expect(module.default.__injected).toBe(true)
      expect(dependencies).toEqual([
        slash(resolve(import.meta.dirname, './packages/parent/index.ts')),
      ])

      // confirm that it fails with a bundle approach
      if (!isTypeStrippingSupported) {
        await expect(async () => {
          const root = resolve(import.meta.dirname, './fixtures/runner-import')
          await loadConfigFromFile(
            { mode: 'production', command: 'serve' },
            resolve(root, './vite.config.outside-pkg-import.mts'),
            root,
            'silent',
          )
        }).rejects.toThrow('Unknown file extension ".ts"')
      }
    })
  // ── END TARGET TEST ─────────────────────────────
});