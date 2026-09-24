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
  test('importing a basic file works', async () => {
      const { module } = await runnerImport<
        typeof import('./fixtures/runner-import/basic')
      >(fixture('basic'))
      expect(module.test).toEqual({
        field: true,
      })
    })
  // ── END TARGET TEST ─────────────────────────────
});