import { resolve } from 'node:path'
import type { OutputChunk, RolldownOutput } from 'rolldown'
import { describe, expect, test } from 'vitest'
import { build } from '../../build'
import { splitWorkerRequest } from '../../plugins/worker'

const fixturesDir = resolve(import.meta.dirname, 'fixtures')

describe('splitWorkerRequest', () => {

  // ── TARGET TEST ─────────────────────────────────
  test(`splits ${id}`, () => {
        expect(splitWorkerRequest(id)).toEqual({ file: '/worker.js', postfix })
      })
  // ── END TARGET TEST ─────────────────────────────
});