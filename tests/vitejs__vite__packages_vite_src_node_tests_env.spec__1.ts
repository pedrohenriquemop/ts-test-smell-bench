import { join } from 'node:path'
import { describe, expect, test } from 'vitest'
import { loadEnv } from '../env'

const dirname = import.meta.dirname

describe('loadEnv', () => {

  // ── TARGET TEST ─────────────────────────────────
  test('specific prefix', () => {
      expect(loadEnv('development', join(dirname, './env'), 'VVITE'))
        .toMatchInlineSnapshot(`
          {
            "VVITE_A": "A",
            "VVITE_B": "B",
          }
        `)
    })
  // ── END TARGET TEST ─────────────────────────────
});