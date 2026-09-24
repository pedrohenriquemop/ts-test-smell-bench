import { join } from 'node:path'
import { describe, expect, onTestFinished, test, vi } from 'vitest'
import { build } from '../build'
import type { EnvironmentOptions, InlineConfig } from '../config'
import { createServer } from '../server'
import { createServerModuleRunner } from '../ssr/runtime/serverModuleRunner'


describe('file url', () => {
  const fileUrl = new URL('./fixtures/file-url/entry.js', import.meta.url)
  function getConfig(): InlineConfig {
      return {
        configFile: false,
        root: join(import.meta.dirname, 'fixtures/file-url'),
        logLevel: 'error',
        server: {
          middlewareMode: true,
        },
        plugins: [
          {
            name: 'virtual-file-url',
            resolveId(source) {
              if (source.startsWith('virtual:test-dep/')) {
                return '\0' + source
              }
            },
            load(id) {
              if (id === '\0virtual:test-dep/static') {
                return `
                  import * as dep from ${JSON.stringify(fileUrl.href)};
                  export default dep;
                `
              }
              if (id === '\0virtual:test-dep/static-postfix') {
                return `
                  import * as dep from ${JSON.stringify(fileUrl.href + '?query=test')};
                  export default dep;
                `
              }
              if (id === '\0virtual:test-dep/non-static') {
                return `
                  const dep = await import(/* @vite-ignore */ String(${JSON.stringify(fileUrl.href)}));
                  export default dep;
                `
              }
              if (id === '\0virtual:test-dep/non-static-postfix') {
                return `
                  const dep = await import(/* @vite-ignore */ String(${JSON.stringify(fileUrl.href + '?query=test')}));
                  export default dep;
                `
              }
            },
          },
        ],
      }
    }

  // ── TARGET TEST ─────────────────────────────────
  test('dev', async () => {
      const server = await createServer(getConfig())
      onTestFinished(() => server.close())

      const runner = createServerModuleRunner(server.environments.ssr, {
        hmr: {
          logger: false,
        },
        sourcemapInterceptor: false,
      })

      const mod = await runner.import('/entry.js')
      expect(mod.default).toEqual('ok')

      const mod2 = await runner.import(fileUrl.href)
      expect(mod2).toBe(mod)

      const mod3 = await runner.import('virtual:test-dep/static')
      expect(mod3.default).toBe(mod)

      const mod4 = await runner.import('virtual:test-dep/non-static')
      expect(mod4.default).toBe(mod)

      const mod5 = await runner.import(fileUrl.href + '?query=test')
      expect(mod5).toEqual(mod)
      expect(mod5).not.toBe(mod)

      const mod6 = await runner.import('virtual:test-dep/static-postfix')
      expect(mod6.default).toEqual(mod)
      expect(mod6.default).not.toBe(mod)
      expect(mod6.default).toBe(mod5)

      const mod7 = await runner.import('virtual:test-dep/non-static-postfix')
      expect(mod7.default).toEqual(mod)
      expect(mod7.default).not.toBe(mod)
      expect(mod7.default).toBe(mod5)
    })
  // ── END TARGET TEST ─────────────────────────────
});