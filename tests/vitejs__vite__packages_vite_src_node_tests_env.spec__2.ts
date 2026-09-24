import { join } from 'node:path'
import { describe, expect, test } from 'vitest'
import { loadEnv } from '../env'

const dirname = import.meta.dirname

describe('loadEnv', () => {

  // ── TARGET TEST ─────────────────────────────────
  test('override', () => {
      expect(loadEnv('production', join(dirname, './env')))
        .toMatchInlineSnapshot(`
          {
            "VITE_APP_BASE_ROUTE": "/app/",
            "VITE_APP_BASE_URL": "/app/",
          }
        `)
    })
  // ── END TARGET TEST ─────────────────────────────
});