import path from 'node:path'
import type { ResolvedServerUrls } from 'vite'
import { afterEach, describe, expect, test, vi } from 'vitest'
import { createServer, resolveConfig } from '..'
import type { ViteDevServer } from '..'
import { promiseWithResolvers } from '../../shared/utils'
import { createLogger } from '../logger'
import { normalizePath } from '../utils'


describe('the dev server', () => {
  let server: ViteDevServer
  afterEach(async () => {
      await server?.close()
    })

  // ── TARGET TEST ─────────────────────────────────
  test('resolves the server URLs before the httpServer listening events are called', async () => {
      expect.assertions(1)

      const options = {
        port: 5013, // make sure the port is unique
      }

      const { promise, resolve } =
        promiseWithResolvers<ResolvedServerUrls | null>()
      server = await createServer({
        root: import.meta.dirname,
        logLevel: 'error',
        // `server.listen()` would otherwise start a dep scan that crawls every
        // HTML fixture under `__tests__`
        optimizeDeps: {
          noDiscovery: true,
          include: [],
        },
        server: {
          strictPort: true,
          ws: false,
          ...options,
        },
        plugins: [
          {
            name: 'test',
            configureServer(server) {
              server.httpServer?.on('listening', () => {
                resolve(server.resolvedUrls)
              })
            },
          },
        ],
      })

      await server.listen()
      const urls = await promise

      expect(urls).toStrictEqual({
        local: ['http://localhost:5013/'],
        network: [],
        networkInterfaceNames: [],
      })
    })
  // ── END TARGET TEST ─────────────────────────────
});