import http from 'node:http'
import net from 'node:net'
import { afterEach, describe, expect, test, vi } from 'vitest'
import { createServer } from '..'
import type { InlineConfig, ViteDevServer } from '..'
import { wildcardHosts } from '../constants'

const BASE_PORT = 15181
const optimizeDeps: InlineConfig['optimizeDeps'] = {
  noDiscovery: true,
  include: [],
}

describe('port detection', () => {
  let blockingServer: http.Server | null = null
  let viteServer: ViteDevServer | null = null
  afterEach(async () => {
      if (viteServer) {
        await viteServer.close()
        viteServer = null
      }

      await new Promise<void>((resolve) => {
        if (blockingServer) {
          blockingServer.close(() => resolve())
          blockingServer = null
        } else {
          resolve()
        }
      })
    })
  async function createSimpleServer(port: number, host: string) {
      const server = http.createServer()
      await new Promise<void>((resolve) => {
        server.listen(port, host, () => resolve())
      })
      return {
        [Symbol.asyncDispose]() {
          return new Promise<void>((resolve) => {
            server.close(() => resolve())
          })
        },
      }
    }

  describe('port fallback', () => {

    // ── TARGET TEST ─────────────────────────────────
    test('wildcard check also runs after EADDRINUSE fallback', async () => {
          // localhost:n occupied
          // 0.0.0.0:n+1 occupied
          // => Vite should pick n+2

          await using _localhostServer = await createSimpleServer(
            BASE_PORT,
            'localhost',
          )
          await using _wildcardServer = await createSimpleServer(
            BASE_PORT + 1,
            '0.0.0.0',
          )

          viteServer = await createServer({
            root: import.meta.dirname,
            optimizeDeps,
            logLevel: 'silent',
            server: {
              port: BASE_PORT,
              strictPort: false,
              ws: false,
            },
          })
          await viteServer.listen()

          const address = viteServer.httpServer!.address()
          expect(address).toStrictEqual(
            expect.objectContaining({ port: BASE_PORT + 2 }),
          )
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});