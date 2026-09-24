import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { type ViteDevServer, createServer } from '../index'

const stubGetWatchedCode = /\(\)\s*\{\s*return this;\s*\}/

describe('watcher configuration', () => {
  let server: ViteDevServer | undefined
  afterEach(async () => {
      if (server) {
        await server.close()
        server = undefined
      }
    })

  // ── TARGET TEST ─────────────────────────────────
  it('when watcher is disabled, return noop watcher', async () => {
      server = await createServer({
        server: {
          watch: null,
        },
      })
      expect(server.watcher.add.toString()).toMatch(stubGetWatchedCode)
    })
  // ── END TARGET TEST ─────────────────────────────
});