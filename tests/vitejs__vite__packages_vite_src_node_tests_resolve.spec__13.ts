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
  test('build', async () => {
      await build({
        ...getConfig(),
        build: {
          ssr: true,
          outDir: 'dist/basic',
          rolldownOptions: {
            input: { index: fileUrl.href },
          },
        },
      })
      const mod1 = await import(
        join(import.meta.dirname, 'fixtures/file-url/dist/basic/index.js')
      )
      expect(mod1.default).toBe('ok')

      await build({
        ...getConfig(),
        build: {
          ssr: true,
          outDir: 'dist/virtual',
          rolldownOptions: {
            input: { index: 'virtual:test-dep/static' },
          },
        },
      })
      const mod2 = await import(
        join(import.meta.dirname, 'fixtures/file-url/dist/virtual/index.js')
      )
      expect(mod2.default.default).toBe('ok')
    })
  // ── END TARGET TEST ─────────────────────────────
});