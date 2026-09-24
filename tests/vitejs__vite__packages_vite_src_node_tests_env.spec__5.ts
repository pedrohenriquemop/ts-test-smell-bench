import { join } from 'node:path'
import { describe, expect, test } from 'vitest'
import { loadEnv } from '../env'

const dirname = import.meta.dirname

describe('loadEnv', () => {

  // ── TARGET TEST ─────────────────────────────────
  test('VITE_USER_NODE_ENV for dev behaviour in build', () => {
      const _nodeEnv = process.env.NODE_ENV
      process.env.NODE_ENV = 'production'
      loadEnv('testing', join(dirname, './env'))
      expect(process.env.VITE_USER_NODE_ENV).toEqual('development')
      process.env.NODE_ENV = _nodeEnv
    })
  // ── END TARGET TEST ─────────────────────────────
});