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

  // ── TARGET TEST ─────────────────────────────────
  test('non-EADDRINUSE errors on wildcard do not block port selection', async () => {
      const originalCreateServer = net.createServer.bind(net)
      using _ = vi.spyOn(net, 'createServer').mockImplementation(() => {
        const server = originalCreateServer()
        const originalListen = server.listen.bind(server)
        // @ts-expect-error this is the overload used internally
        server.listen = (
          port: number,
          host: string,
          ...args: unknown[]
        ): net.Server => {
          if (wildcardHosts.has(host)) {
            process.nextTick(() => {
              const err: NodeJS.ErrnoException = new Error(
                'listen EACCES: permission denied',
              )
              err.code = 'EACCES'
              server.emit('error', err)
            })
            return server
          }
          // @ts-expect-error this is the overload used internally
          return originalListen(port, host, ...args)
        }
        return server
      })

      viteServer = await createServer({
        root: import.meta.dirname,
        optimizeDeps,
        logLevel: 'silent',
        server: { port: BASE_PORT, strictPort: false, ws: false },
      })
      await viteServer.listen()

      const address = viteServer.httpServer!.address()
      expect(address).toStrictEqual(expect.objectContaining({ port: BASE_PORT }))
    })
  // ── END TARGET TEST ─────────────────────────────
});