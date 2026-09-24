import { RUNTIME_MODULE_ID } from 'rolldown'
import { exactRegex } from 'rolldown/filter'
import { afterAll, describe, expect, test, vi } from 'vitest'
import { type InlineConfig, type Plugin, build, createServer } from '../..'

const getConfigWithPlugin = (
  plugins: Plugin[],
  input?: string[],
): InlineConfig => {
  return {
    configFile: false,
    server: { middlewareMode: true, ws: false },
    optimizeDeps: { noDiscovery: true, include: [] },
    build: { rolldownOptions: { input }, write: false },
    plugins,
    logLevel: 'silent',
  }
}

describe('hook filter with plugin container', () => {
  const resolveId = vi.fn()
  const load = vi.fn()
  const transformWithId = vi.fn()
  const transformWithCode = vi.fn()
  const any = expect.toSatisfy(() => true)
  const config = getConfigWithPlugin([
      {
        name: 'test',
        resolveId: {
          filter: { id: /\.js$/ },
          handler: resolveId,
        },
        load: {
          filter: { id: '**/*.js' },
          handler: load,
        },
        transform: {
          filter: { id: '**/*.js' },
          handler: transformWithId,
        },
      },
      {
        name: 'test2',
        transform: {
          filter: { code: 'import.meta' },
          handler: transformWithCode,
        },
      },
    ])
  const server = await createServer(config)
  afterAll(async () => {
      await server.close()
    })
  const pluginContainer = server.environments.ssr.pluginContainer

  // ── TARGET TEST ─────────────────────────────────
  test('resolveId', async () => {
      await pluginContainer.resolveId('foo.js')
      await pluginContainer.resolveId('foo.ts')
      expect(resolveId).toHaveBeenCalledTimes(1)
      expect(resolveId).toHaveBeenCalledWith('foo.js', any, any)
    })
  // ── END TARGET TEST ─────────────────────────────
});