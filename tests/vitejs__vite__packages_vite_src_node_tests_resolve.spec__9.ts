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

  describe('environment builtins', () => {
    function getConfig(
          targetEnv: 'client' | 'ssr' | string,
          builtins: NonNullable<EnvironmentOptions['resolve']>['builtins'],
        ): InlineConfig {
          return {
            configFile: false,
            root: join(import.meta.dirname, 'fixtures/file-url'),
            logLevel: 'error',
            server: {
              middlewareMode: true,
            },
            environments: {
              [targetEnv]: {
                resolve: {
                  builtins,
                },
              },
            },
          }
        }
    async function run({
          builtins,
          targetEnv = 'custom',
          testEnv = 'custom',
          idToResolve,
        }: {
          builtins?: NonNullable<EnvironmentOptions['resolve']>['builtins']
          targetEnv?: 'client' | 'ssr' | string
          testEnv?: 'client' | 'ssr' | string
          idToResolve: string
        }) {
          const server = await createServer(getConfig(targetEnv, builtins))
          vi.spyOn(server.config.logger, 'warn').mockImplementationOnce(
            (message) => {
              throw new Error(message)
            },
          )
          onTestFinished(() => server.close())

          return server.environments[testEnv]?.pluginContainer.resolveId(
            idToResolve,
          )
        }

    // ── TARGET TEST ─────────────────────────────────
    test('no default to node-like builtins for client environment', async () => {
          const resolved = await run({
            idToResolve: 'node:fs',
            testEnv: 'client',
          })
          expect(resolved?.id).toEqual('__vite-browser-external:node:fs')
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});