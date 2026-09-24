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

// ── TARGET TEST ─────────────────────────────────
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
// ── END TARGET TEST ─────────────────────────────
describe.runIf(isServe)('fetchModule via WebSocket', () => {
  const root = path.resolve(
    import.meta.dirname.replace('playground', 'playground-temp'),
    '..',
  )

  const fetchModuleViaWebSocket = async (filePath: string) => {
    const resolvedPath = path.resolve(root, filePath)
    const token = viteServer.config.webSocketToken
    const wsUrl = viteTestUrl.replace('http', 'ws')
    const ws = new WebSocket(`${wsUrl}?token=${token}`, ['vite-hmr'])

    try {
      return await Promise.race([
        new Promise<any>((resolve, reject) => {
          ws.on('open', () => {
            ws.send(
              JSON.stringify({
                type: 'custom',
                event: 'vite:invoke',
                data: {
                  name: 'fetchModule',
                  id: 'send:1',
                  data: [pathToFileURL(resolvedPath).href],
                },
              }),
            )
          })

          ws.on('message', (raw: Buffer) => {
            const parsed = JSON.parse(raw.toString())
            if (
              parsed.type === 'custom' &&
              parsed.event === 'vite:invoke' &&
              parsed.data?.id === 'response:1'
            ) {
              resolve(parsed.data.data)
            }
          })

          ws.on('error', (err) => {
            reject(err)
          })
        }),
        setTimeout(10_000).then(() =>
          Promise.reject(new Error('WebSocket response timed out')),
        ),
      ])
    } finally {
      ws.close()
    }
  }

  test('should not read files inside allowed directories as fetchModule is disabled', async () => {
    const result = await fetchModuleViaWebSocket('root/src/safe.txt?raw')
    expect(result.result).toBeUndefined()
    expect(result.error).toBeTruthy()
  })

  test('should not read files outside allowed directories', async () => {
    const result = await fetchModuleViaWebSocket('root/unsafe.txt?raw')
    expect(result.result).toBeUndefined()
    expect(result.error).toBeTruthy()
  })
})
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