import { fileURLToPath } from 'node:url'
import { describe, expect, test } from 'vitest'
import { PartialEnvironment } from '../baseEnvironment'
import { resolveConfig } from '../config'
import { createIsConfiguredAsExternal } from '../external'


describe('createIsConfiguredAsExternal', () => {

  // ── TARGET TEST ─────────────────────────────────
  test('force external', async () => {
      const isExternal = await createIsExternal(true)
      expect(isExternal('@vitejs/cjs-ssr-dep')).toBe(true)
    })
  // ── END TARGET TEST ─────────────────────────────
});
async function createIsExternal(external?: true) {
  const resolvedConfig = await resolveConfig(
    {
      configFile: false,
      root: fileURLToPath(new URL('./', import.meta.url)),
      resolve: { external },
    },
    'serve',
  )
  const environment = new PartialEnvironment('ssr', resolvedConfig)
  return createIsConfiguredAsExternal(environment)
}