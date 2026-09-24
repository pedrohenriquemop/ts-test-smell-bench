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
  it('should watch the root directory, config file dependencies, dotenv files, and the public directory', async () => {
      const root = fileURLToPath(
        new URL('./fixtures/watcher/nested-root', import.meta.url),
      )
      server = await createServer({ root })
      await new Promise((resolve) => server!.watcher.once('ready', resolve))
      // Perform retries here as chokidar may still not be completely watching all directories
      // after the `ready` event
      await vi.waitFor(() => {
        const watchedDirs = Object.keys(server!.watcher.getWatched())
        expect(watchedDirs).toEqual(
          expect.arrayContaining([
            root,
            resolve(root, '../config-deps'),
            resolve(root, '../custom-env'),
            resolve(root, '../custom-public'),
          ]),
        )
      })
    })
  // ── END TARGET TEST ─────────────────────────────
});