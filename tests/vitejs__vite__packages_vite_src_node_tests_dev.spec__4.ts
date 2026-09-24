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
  test('does not ignore buildStart errors while resolving fallback inputs', async () => {
      server = await createServer({
        configFile: false,
        root: path.join(import.meta.dirname, 'fixtures', 'input-option'),
        logLevel: 'silent',
        optimizeDeps: { noDiscovery: true },
        plugins: [
          {
            name: 'failing-build-start',
            perEnvironmentStartEndDuringDev: true,
            buildStart() {
              if (this.environment.name === 'ssr') {
                throw new Error('buildStart failed')
              }
            },
          },
        ],
        server: {
          fs: { allow: [] },
          middlewareMode: true,
          watch: null,
          ws: false,
        },
      })

      await expect(
        server.environments.ssr.pluginContainer.buildStart(),
      ).rejects.toThrow('buildStart failed')
    })
  // ── END TARGET TEST ─────────────────────────────
});