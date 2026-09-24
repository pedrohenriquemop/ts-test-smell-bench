import { join } from 'node:path'
import { describe, expect, onTestFinished, test, vi } from 'vitest'
import { build } from '../build'
import type { EnvironmentOptions, InlineConfig } from '../config'
import { createServer } from '../server'
import { createServerModuleRunner } from '../ssr/runtime/serverModuleRunner'


describe('import and resolveId', () => {
  async function createTestServer() {
      const server = await createServer({
        configFile: false,
        root: import.meta.dirname,
        logLevel: 'error',
        // the scanner would otherwise crawl every HTML fixture under `__tests__`
        optimizeDeps: {
          noDiscovery: true,
          include: [],
        },
        server: {
          middlewareMode: true,
          ws: false,
        },
      })
      onTestFinished(() => server.close())
      const runner = createServerModuleRunner(server.environments.ssr, {
        hmr: {
          logger: false,
        },
        sourcemapInterceptor: false,
      })
      return { server, runner }
    }

  // ── TARGET TEST ─────────────────────────────────
  test('import first', async () => {
      const { server, runner } = await createTestServer()
      const mod = await runner.import(
        '/fixtures/test-dep-conditions-app/entry-with-module',
      )
      const resolved = await server.environments.ssr.pluginContainer.resolveId(
        '@vitejs/test-dep-conditions/with-module',
      )
      expect([mod.default, resolved?.id]).toEqual([
        'dir/index.default.js',
        expect.stringContaining('dir/index.module.js'),
      ])
    })
  // ── END TARGET TEST ─────────────────────────────
});