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
  test('can import vite config', async () => {
      const { module, dependencies } = await runnerImport<
        typeof import('./fixtures/runner-import/vite.config')
      >(fixture('vite.config'))
      expect(module.default).toEqual({
        root: './test',
        plugins: [
          {
            name: 'test',
          },
        ],
      })
      expect(dependencies).toEqual([slash(fixture('plugin.ts'))])
    })
  // ── END TARGET TEST ─────────────────────────────
});