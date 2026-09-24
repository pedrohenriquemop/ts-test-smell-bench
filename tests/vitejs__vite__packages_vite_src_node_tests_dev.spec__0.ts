import path from 'node:path'
import type { ResolvedServerUrls } from 'vite'
import { afterEach, describe, expect, test, vi } from 'vitest'
import { createServer, resolveConfig } from '..'
import type { ViteDevServer } from '..'
import { promiseWithResolvers } from '../../shared/utils'
import { createLogger } from '../logger'
import { normalizePath } from '../utils'


describe('resolveBuildEnvironmentOptions in dev', () => {

  // ── TARGET TEST ─────────────────────────────────
  test('build.rolldownOptions should not have input in lib', async () => {
      const config = await resolveConfig(
        {
          build: {
            lib: {
              entry: './index.js',
            },
          },
        },
        'serve',
      )

      expect(config.build.rolldownOptions).not.toHaveProperty('input')
    })
  // ── END TARGET TEST ─────────────────────────────
});