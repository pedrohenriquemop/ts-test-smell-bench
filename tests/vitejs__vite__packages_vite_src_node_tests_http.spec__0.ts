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
    test('uses the same ephemeral port on every interface', async () => {
          using listen = vi.spyOn(net.Server.prototype, 'listen')

          viteServer = await createServer({
            root: import.meta.dirname,
            optimizeDeps,
            logLevel: 'silent',
            server: { port: 0, ws: false },
          })
          await viteServer.listen()

          const address = viteServer.httpServer!.address()
          expect(address).toStrictEqual(
            expect.objectContaining({ port: expect.any(Number) }),
          )
          const assignedPort = (address as net.AddressInfo).port
          expect(viteServer._currentServerPort).toBe(assignedPort)
          const [firstWildcardHost, ...remainingWildcardHosts] = wildcardHosts
          expect(
            listen.mock.calls.map(([port, host]) => ({ port, host })),
          ).toStrictEqual([
            { port: 0, host: firstWildcardHost },
            ...remainingWildcardHosts.map((host) => ({
              port: assignedPort,
              host,
            })),
            { port: assignedPort, host: 'localhost' }, // Check configured host
            { port: assignedPort, host: 'localhost' }, // Bind HTTP server
          ])
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});