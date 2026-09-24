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
  test('transform', async () => {
      await server.environments.ssr.moduleGraph.ensureEntryFromUrl('foo.js')
      await server.environments.ssr.moduleGraph.ensureEntryFromUrl('foo.ts')

      await pluginContainer.transform('import_meta', 'foo.js')
      await pluginContainer.transform('import.meta', 'foo.ts')
      expect(transformWithId).toHaveBeenCalledTimes(1)
      expect(transformWithId).toHaveBeenCalledWith(
        expect.stringContaining('import_meta'),
        'foo.js',
        any,
      )
      expect(transformWithCode).toHaveBeenCalledTimes(1)
      expect(transformWithCode).toHaveBeenCalledWith(
        expect.stringContaining('import.meta'),
        'foo.ts',
        any,
      )
    })
  // ── END TARGET TEST ─────────────────────────────
});