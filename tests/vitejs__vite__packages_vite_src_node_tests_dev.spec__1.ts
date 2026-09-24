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
  test('resolves each environment input as a safe module', async () => {
      const root = path.join(import.meta.dirname, 'fixtures', 'input-option')
      const clientEntry = normalizePath(path.join(root, 'client-entry.js'))
      const ssrEntry = normalizePath(path.join(root, 'ssr-entry.js'))

      server = await createServer({
        configFile: false,
        root,
        input: 'virtual:client-entry',
        environments: {
          ssr: { input: { main: 'virtual:ssr-entry' } },
        },
        optimizeDeps: { noDiscovery: true },
        server: { fs: { allow: [] }, middlewareMode: true, ws: false },
        plugins: [
          {
            name: 'resolve-environment-entries',
            resolveId(id) {
              if (id === `virtual:${this.environment.name}-entry`) {
                return this.environment.name === 'client' ? clientEntry : ssrEntry
              }
            },
          },
        ],
      })

      expect(server.config.safeModulePaths).toStrictEqual(new Set([clientEntry]))
      await server.environments.ssr.pluginContainer.buildStart()
      expect(server.config.safeModulePaths).toStrictEqual(
        new Set([clientEntry, ssrEntry]),
      )
    })
  // ── END TARGET TEST ─────────────────────────────
});