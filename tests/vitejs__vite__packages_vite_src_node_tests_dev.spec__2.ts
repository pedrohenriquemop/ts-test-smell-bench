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
  test('does not mark an external environment input as safe', async () => {
      const root = path.join(import.meta.dirname, 'fixtures', 'input-option')
      const externalEntry = normalizePath(path.join(root, 'external-entry.js'))

      server = await createServer({
        configFile: false,
        root,
        input: 'virtual:external-entry',
        optimizeDeps: { noDiscovery: true },
        server: { fs: { allow: [] }, middlewareMode: true, ws: false },
        plugins: [
          {
            name: 'external-environment-entry',
            resolveId(id) {
              if (id === 'virtual:external-entry') {
                return { id: externalEntry, external: true }
              }
            },
          },
        ],
      })

      expect(server.config.safeModulePaths).not.toContain(externalEntry)
    })
  // ── END TARGET TEST ─────────────────────────────
});