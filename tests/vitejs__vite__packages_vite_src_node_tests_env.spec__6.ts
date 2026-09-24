import { join } from 'node:path'
import { describe, expect, test } from 'vitest'
import { loadEnv } from '../env'

const dirname = import.meta.dirname

describe('loadEnv', () => {

  // ── TARGET TEST ─────────────────────────────────
  test('Already exists VITE_USER_NODE_ENV', () => {
      process.env.VITE_USER_NODE_ENV = 'test'
      loadEnv('development', join(dirname, './env'))
      expect(process.env.VITE_USER_NODE_ENV).toEqual('test')
    })
  // ── END TARGET TEST ─────────────────────────────
});