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

describe('hook filter with build', () => {
  const resolveId = vi.fn()
  const load = vi.fn()
  const transformWithId = vi.fn()
  const transformWithCode = vi.fn()
  const any = expect.anything()
  const config = getConfigWithPlugin(
      [
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
            filter: {
              id: {
                include: '**/*.js',
                exclude: exactRegex(RUNTIME_MODULE_ID),
              },
            },
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
        {
          name: 'resolver',
          resolveId(id) {
            return id
          },
          load(id) {
            if (id === 'foo.js') {
              return 'import "foo.ts"\n' + 'import_meta'
            }
            if (id === 'foo.ts') {
              return 'import.meta'
            }
          },
        },
      ],
      ['foo.js', 'foo.ts'],
    )
  await build(config)

  // ── TARGET TEST ─────────────────────────────────
  test('load', async () => {
      expect(load).toHaveBeenCalledTimes(1)
      expect(load).toHaveBeenCalledWith('foo.js', any)
    })
  // ── END TARGET TEST ─────────────────────────────
});