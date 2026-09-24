import { join } from 'node:path'
import { describe, expect, test } from 'vitest'
import { loadEnv } from '../env'

const dirname = import.meta.dirname

describe('loadEnv', () => {

  // ── TARGET TEST ─────────────────────────────────
  test('basic', () => {
      expect(loadEnv('development', join(dirname, './env')))
        .toMatchInlineSnapshot(`
          {
            "VITE_APP_BASE_ROUTE": "/",
            "VITE_APP_BASE_URL": "/",
            "VITE_ENV1": "ENV1",
            "VITE_ENV2": "ENV2",
            "VITE_ENV3": "ENV3",
          }
        `)
    })
  // ── END TARGET TEST ─────────────────────────────
});