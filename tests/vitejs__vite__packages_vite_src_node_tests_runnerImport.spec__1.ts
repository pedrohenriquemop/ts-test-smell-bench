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
  test("cannot import cjs, 'runnerImport' doesn't support CJS syntax at all", async () => {
      await expect(() =>
        runnerImport<typeof import('./fixtures/runner-import/basic')>(
          fixture('cjs.js'),
        ),
      ).rejects.toThrow('module is not defined')
    })
  // ── END TARGET TEST ─────────────────────────────
});