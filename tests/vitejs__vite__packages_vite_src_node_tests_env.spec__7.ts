import { join } from 'node:path'
import { describe, expect, test } from 'vitest'
import { loadEnv } from '../env'

const dirname = import.meta.dirname

describe('loadEnv', () => {

  // ── TARGET TEST ─────────────────────────────────
  test('prioritize existing process.env', () => {
      process.env.VITE_ENV_TEST_ENV = 'EXIST'
      expect(loadEnv('existing', join(dirname, './env'))).toMatchInlineSnapshot(`
          {
            "VITE_APP_BASE_ROUTE": "/",
            "VITE_APP_BASE_URL": "/",
            "VITE_ENV_TEST_ENV": "EXIST",
            "VITE_USER_NODE_ENV": "test",
          }
        `)
    })
  // ── END TARGET TEST ─────────────────────────────
});