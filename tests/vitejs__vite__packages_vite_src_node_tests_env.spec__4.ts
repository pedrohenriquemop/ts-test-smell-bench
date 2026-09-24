import { join } from 'node:path'
import { describe, expect, test } from 'vitest'
import { loadEnv } from '../env'

const dirname = import.meta.dirname

describe('loadEnv', () => {

  // ── TARGET TEST ─────────────────────────────────
  test('VITE_USER_NODE_ENV', () => {
      loadEnv('development', join(dirname, './env'))
      expect(process.env.VITE_USER_NODE_ENV).toEqual(undefined)
    })
  // ── END TARGET TEST ─────────────────────────────
});