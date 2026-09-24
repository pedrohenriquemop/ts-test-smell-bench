import { resolve } from 'node:path'
import type { OutputChunk, RolldownOutput } from 'rolldown'
import { describe, expect, test } from 'vitest'
import { build } from '../../build'
import { splitWorkerRequest } from '../../plugins/worker'

const fixturesDir = resolve(import.meta.dirname, 'fixtures')

// ── TARGET TEST ─────────────────────────────────
test('?worker&url should produce the same hash in client and SSR builds', async () => {
  const root = resolve(fixturesDir, 'worker-url')

  const clientResult = (await build({
    root,
    logLevel: 'silent',
    build: {
      write: false,
      rolldownOptions: {
        input: resolve(root, 'entry.js'),
      },
    },
  })) as RolldownOutput

  const ssrResult = (await build({
    root,
    logLevel: 'silent',
    build: {
      write: false,
      ssr: resolve(root, 'entry.js'),
    },
  })) as RolldownOutput

  // Extract the worker URL from both builds.
  // The entry chunk will contain the worker asset URL as a string.
  const clientEntry = clientResult.output.find(
    (o): o is OutputChunk => o.type === 'chunk' && o.isEntry,
  )!
  const ssrEntry = ssrResult.output.find(
    (o): o is OutputChunk => o.type === 'chunk' && o.isEntry,
  )!

  const workerUrlPattern = /assets\/worker-[\w-]+\.js/g
  const clientWorkerUrls = clientEntry.code.match(workerUrlPattern) ?? []
  const ssrWorkerUrls = ssrEntry.code.match(workerUrlPattern) ?? []

  expect(clientWorkerUrls.length).toBeGreaterThan(0)
  expect(ssrWorkerUrls.length).toBeGreaterThan(0)
  expect(ssrWorkerUrls).toEqual(clientWorkerUrls)
})
// ── END TARGET TEST ─────────────────────────────