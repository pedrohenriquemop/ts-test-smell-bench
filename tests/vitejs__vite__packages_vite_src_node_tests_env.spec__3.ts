import { join } from 'node:path'
import { describe, expect, test } from 'vitest'
import { loadEnv } from '../env'

const dirname = import.meta.dirname

describe('loadEnv', () => {

  // ── TARGET TEST ─────────────────────────────────
  test('override 2', () => {
      expect(loadEnv('development2', join(dirname, './env')))
        .toMatchInlineSnapshot(`
          {
            "VITE_APP_BASE_ROUTE": "source",
            "VITE_APP_BASE_URL": "source",
            "VITE_SOURCE": "source",
          }
        `)
    })
  // ── END TARGET TEST ─────────────────────────────
});