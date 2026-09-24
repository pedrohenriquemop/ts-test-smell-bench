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
  test('silently resolves index.html as the fallback for every environment', async () => {
      const root = path.join(import.meta.dirname, 'fixtures', 'input-option')
      const clientEntry = normalizePath(path.join(root, 'client-index.html'))
      const resolvedEnvironments = new Set<string>()
      const logger = createLogger('silent')
      logger.warn = vi.fn()

      server = await createServer({
        configFile: false,
        root,
        customLogger: logger,
        optimizeDeps: { noDiscovery: true },
        server: { fs: { allow: [] }, middlewareMode: true, ws: false },
        plugins: [
          {
            name: 'resolve-environment-index',
            resolveId(id) {
              if (id !== 'index.html') return
              resolvedEnvironments.add(this.environment.name)
              if (this.environment.name === 'ssr') {
                throw new Error('ssr does not have an HTML entry')
              }
              return clientEntry
            },
          },
        ],
      })

      expect(resolvedEnvironments).toStrictEqual(new Set(['client']))
      await server.environments.ssr.pluginContainer.buildStart()
      expect(resolvedEnvironments).toStrictEqual(new Set(['client', 'ssr']))
      expect(server.config.safeModulePaths).toStrictEqual(new Set([clientEntry]))
      expect(logger.warn).not.toHaveBeenCalled()
    })
  // ── END TARGET TEST ─────────────────────────────
});