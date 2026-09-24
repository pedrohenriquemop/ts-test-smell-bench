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
  test('allows binding to specific host with strictPort when wildcard port is in use', async () => {
      await using _wildcardServer = await createSimpleServer(BASE_PORT, '0.0.0.0')

      const warnMessages: string[] = []
      viteServer = await createServer({
        root: import.meta.dirname,
        optimizeDeps,
        customLogger: {
          info: () => {},
          warn: (msg) => warnMessages.push(msg),
          warnOnce: () => {},
          error: () => {},
          clearScreen: () => {},
          hasErrorLogged: () => false,
          hasWarned: false,
        },
        server: {
          port: BASE_PORT,
          host: '127.0.0.1',
          strictPort: true,
          ws: false,
        },
      })

      try {
        await viteServer.listen()
      } catch (e) {
        // it may not be allowed to bind to specific host when wildcard port is in use
        expect(() => {
          throw e
        }).toThrow(`Port ${BASE_PORT} is already in use`)
        return
      }

      const address = viteServer.httpServer!.address()
      expect(address).toStrictEqual(expect.objectContaining({ port: BASE_PORT }))
      expect(warnMessages).toContainEqual(expect.stringContaining('wildcard'))
    })
  // ── END TARGET TEST ─────────────────────────────
});