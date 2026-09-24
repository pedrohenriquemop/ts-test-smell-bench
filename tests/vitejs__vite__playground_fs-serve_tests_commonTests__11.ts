import fs from 'node:fs'
import http from 'node:http'
import path from 'node:path'
import { setTimeout } from 'node:timers/promises'
import { pathToFileURL } from 'node:url'
import type { Page } from 'playwright-chromium'
import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
} from 'vitest'
import WebSocket from 'ws'
import { browser, isServe, page, viteServer, viteTestUrl } from '~utils'
import { getWindows83ShortNameForDotEnv as getWindows83ShortNameForDotEnv } from '../root/windows83Filename'
import testJSON from '../safe.json'

const getViteTestIndexHtmlUrl = () => {
  const srcPrefix = viteTestUrl.endsWith('/') ? '' : '/'
  // NOTE: viteTestUrl is set lazily
  return viteTestUrl + srcPrefix + 'src/'
}
const safeJsonContent = fs.readFileSync(
  path.resolve(import.meta.dirname, '../safe.json'),
  'utf-8',
)
const stringified = JSON.stringify(testJSON)
beforeAll(async () => {
  await page.goto(getViteTestIndexHtmlUrl())
})
describe.runIf(isServe)('normal', () => {
  test('default import', async () => {
    await expect.poll(() => page.textContent('.full')).toBe(stringified)
  })

  test('named import', async () => {
    await expect.poll(() => page.textContent('.named')).toBe(testJSON.msg)
  })

  test('nested entry', async () => {
    await expect.poll(() => page.textContent('.nested-entry')).toBe('foobar')
  })

  test('virtual svg module', async () => {
    await expect.poll(() => page.textContent('.virtual-svg')).toMatch('<svg')
  })
})
describe.runIf(isServe)('matrix', () => {
  const dotEnvWindows83ShortName = getWindows83ShortNameForDotEnv()

  const variants = [
    { variantId: '', variantName: 'normal' },
    { variantId: '-fs', variantName: '/@fs/' },
  ] as const
  type VariantId = (typeof variants)[number]['variantId']
  const cases: Array<{
    name: string
    testId: string
    content: string | RegExp
    status: string | string[]
    disableVariants?: VariantId[]
    skip?: boolean
    isSPAFallback?: boolean
  }> = [
    {
      name: 'safe fetch',
      testId: 'safe',
      content: /KEY=safe/,
      status: '200',
    },
    {
      name: 'safe fetch with query',
      testId: 'safe-query',
      content: /KEY=safe/,
      status: '200',
    },
    {
      name: 'safe fetch in subdir',
      testId: 'safe-subdir',
      content: /KEY=safe/,
      status: '200',
    },
    {
      name: 'safe fetch with special characters',
      testId: 'safe-subdir-special-characters',
      content: /KEY=safe/,
      status: '200',
    },
    {
      name: 'safe fetch with special characters 2',
      testId: 'safe-subdir-special-characters2',
      content: safeJsonContent,
      status: '200',
    },
    {
      name: 'safe fetch imported',
      testId: 'safe-imported',
      content: safeJsonContent,
      status: '200',
      disableVariants: [''],
    },
    {
      name: 'safe fetch imported with query',
      testId: 'safe-imported-query',
      content: safeJsonContent,
      status: '200',
      disableVariants: [''],
    },

    {
      name: 'unsafe fetch',
      testId: 'unsafe',
      content: /403 Restricted/,
      status: '403',
    },
    {
      name: 'unsafe JSON fetch',
      testId: 'unsafe-json',
      content: /403 Restricted/,
      status: '403',
      disableVariants: [''],
    },
    {
      name: 'unsafe HTML fetch',
      testId: 'unsafe-html',
      content: /403 Restricted/,
      status: '403',
    },
    {
      name: 'unsafe HTML fetch outside root',
      testId: 'unsafe-html-outside-root',
      content: /403 Restricted/,
      status: '403',
      disableVariants: [''],
    },
    {
      name: 'unsafe fetch with special characters (#8498)',
      testId: 'unsafe-8498',
      content: '',
      status: '404',
    },
    {
      name: 'unsafe fetch with special characters 2 (#8498)',
      testId: 'unsafe-8498-2',
      content: '',
      status: '404',
    },
    {
      name: 'unsafe fetch import inline',
      testId: 'unsafe-import-inline',
      content: /403 Restricted/,
      status: '403',
    },
    {
      name: 'unsafe fetch raw query import',
      testId: 'unsafe-raw-query-import',
      content: /403 Restricted/,
      status: '403',
    },
    {
      name: 'unsafe fetch raw import raw outside root',
      testId: 'unsafe-raw-import-raw-outside-root',
      content: /403 Restricted/,
      status: '403',
      disableVariants: [''],
    },
    {
      name: 'unsafe fetch raw import raw outside root 1',
      testId: 'unsafe-raw-import-raw-outside-root1',
      content: /403 Restricted/,
      status: '403',
      disableVariants: [''],
    },
    {
      name: 'unsafe fetch raw import raw outside root 2',
      testId: 'unsafe-raw-import-raw-outside-root2',
      content: /403 Restricted/,
      status: '403',
      disableVariants: [''],
    },
    {
      name: 'unsafe fetch with ?url query',
      testId: 'unsafe-url',
      content: /403 Restricted/,
      status: '403',
    },
    {
      name: 'unsafe fetch ?.svg?import',
      testId: 'unsafe-query-dot-svg-import',
      content: /403 Restricted/,
      status: '403',
    },
    {
      name: 'unsafe fetch .svg?import',
      testId: 'unsafe-svg',
      content: /403 Restricted/,
      status: '403',
    },
    {
      name: 'unsafe fetch import inline wasm init',
      testId: 'unsafe-import-inline-wasm-init',
      content: /403 Restricted/,
      status: '403',
    },
    // It is 404 in `fs-serve/base` test, 403 in `fs-serve` test
    {
      name: 'unsafe fetch with relative path after query',
      testId: 'unsafe-relative-path-after-query',
      content: /403 Restricted|^$/,
      status: ['403', '404'],
      isSPAFallback: true,
    },
    {
      name: 'denied .env',
      testId: 'unsafe-dotenv',
      content: /403 Restricted/,
      status: '403',
    },
    // It is 403 in case insensitive system, 404 in others
    {
      name: 'denied env casing',
      testId: 'unsafe-dotenv-casing',
      content: /403 Restricted|^$/,
      status: ['403', '404'],
    },
    {
      name: 'denied .env with raw query',
      testId: 'unsafe-dotenv-raw',
      content: /403 Restricted/,
      status: '403',
    },
    {
      name: 'denied .env with url query',
      testId: 'unsafe-dotenv-url',
      content: /403 Restricted/,
      status: '403',
    },
    {
      name: 'denied .env with inline query',
      testId: 'unsafe-dotenv-inline',
      content: /403 Restricted/,
      status: '403',
    },
    {
      name: 'denied env with ?.svg?.wasm?init',
      testId: 'unsafe-dotenv-query-dot-svg-wasm-init',
      content: /403 Restricted/,
      status: '403',
    },
    {
      name: 'denied .env with import and raw query',
      testId: 'unsafe-dotenv-import-raw',
      content: /403 Restricted/,
      status: '403',
    },
    // On NTFS, it exposes a file's default data stream through the `::$DATA` suffix,
    // so `.env::$DATA` resolves to the same content as `.env`.
    // It is 404 on non-NTFS.
    {
      name: 'denied .env with NTFS ADS suffix',
      testId: 'unsafe-dotenv-ntfs-ads',
      content: /403 Restricted|^$/,
      status: ['403', '404'],
    },
    // On Windows, the files can be accessed through the 8.3 short name if the feature is enabled.
    // For example, if the short name for `.env` is `ENV~1`, it can be accessed as `ENV~1`.
    {
      name: 'denied .env with 8.3 short name',
      testId: 'unsafe-dotenv-83-short-name',
      content: /403 Restricted/,
      status: '403',
      skip: dotEnvWindows83ShortName === undefined, // skip if 8.3 short name is not available
    },
  ]

  for (const {
    name,
    testId,
    content,
    status,
    disableVariants,
    skip,
    isSPAFallback,
  } of cases) {
    for (const { variantId, variantName } of variants) {
      if (disableVariants?.includes(variantId)) {
        continue
      }

      test.concurrent(
        `${name} (${variantName})`,
        { skip },
        async ({ expect }) => {
          const baseSelector = `.fetch${variantId}-${testId}`
          const actualStatus = expect.poll(() =>
            page.textContent(`${baseSelector}-status`),
          )
          const actualContent = expect.poll(() =>
            page.textContent(`${baseSelector}-content`),
          )

          if (variantName === 'normal' && isSPAFallback) {
            await actualStatus.toBe('200')
            await actualContent.toContain(
              '<h1>FS Serve Matrix Test Summary</h1>',
            )
            return
          }

          if (typeof status === 'string') {
            await actualStatus.toBe(status)
          } else {
            await actualStatus.toBeOneOf(status)
          }

          if (typeof content === 'string') {
            await actualContent.toBe(content)
          } else {
            await actualContent.toMatch(content)
          }
        },
      )
    }
  }
})

// ── TARGET TEST ─────────────────────────────────
test('should not read files outside allowed directories', async () => {
    const result = await fetchModuleViaWebSocket('root/unsafe.txt?raw')
    expect(result.result).toBeUndefined()
    expect(result.error).toBeTruthy()
  })
// ── END TARGET TEST ─────────────────────────────
describe.runIf(!isServe)('preview HTML', () => {
  test('unsafe HTML fetch', async () => {
    await expect
      .poll(() => page.textContent('.fetch-unsafe-html-status'))
      .toBe('404')
    await expect
      .poll(() => page.textContent('.fetch-unsafe-html-content'))
      .toBe('')
  })
})