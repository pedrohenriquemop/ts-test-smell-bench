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

  describe('port reuse on restart', () => {

    // ── TARGET TEST ─────────────────────────────────
    test('reuses the listened port when retrying after a failed listen', async () => {
          await using blockingServer = await createSimpleServer(
            BASE_PORT,
            'localhost',
          )

          viteServer = await createServer({
            root: import.meta.dirname,
            optimizeDeps,
            logLevel: 'silent',
            server: { port: BASE_PORT, ws: false },
          })
          await viteServer.listen()

          const address = viteServer.httpServer!.address() as net.AddressInfo
          const assignedPort = address.port

          await blockingServer[Symbol.asyncDispose]()

          await viteServer.restart()

          expect(viteServer.httpServer!.address()).toStrictEqual(
            expect.objectContaining({ port: assignedPort }),
          )
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});