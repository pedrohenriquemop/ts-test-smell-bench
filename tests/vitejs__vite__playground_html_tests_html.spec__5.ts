import { beforeAll, describe, expect, test } from 'vitest'
import {
  browserLogs,
  editFile,
  getColor,
  isBuild,
  isBundled,
  isServe,
  page,
  serverLogs,
  untilBrowserLogAfter,
  viteServer,
  viteTestUrl,
} from '~utils'

function fetchHtml(p: string) {
  return fetch(viteTestUrl + p, {
    headers: { Accept: 'text/html,*/*' },
  })
}

// ── TARGET TEST ─────────────────────────────────
test('build only transform', async () => {
    if (isBundled) {
      expect(await page.textContent('body p.build')).toMatch(
        'injected only when bundled',
      )
    } else {
      expect(await page.innerHTML('body')).not.toMatch('p class="build"')
    }
  })
// ── END TARGET TEST ─────────────────────────────
describe.runIf(isBuild)('build', () => {
  describe('scriptAsync', () => {
    beforeAll(async () => {
      await page.goto(viteTestUrl + '/scriptAsync.html')
    })

    test('script is async', async () => {
      expect(await page.$('head script[type=module][async]')).toBeTruthy()
      expect(await page.$('head script[type=module]:not([async])')).toBeNull()
    })
  })

  describe('scriptMixed', () => {
    beforeAll(async () => {
      await page.goto(viteTestUrl + '/scriptMixed.html')
    })

    test('script is mixed', async () => {
      expect(await page.$('head script[type=module][async]')).toBeNull()
      expect(await page.$('head script[type=module]:not([async])')).toBeTruthy()
    })
  })

  describe('zeroJS', () => {
    // Ensure that the modulePreload polyfill is discarded in this case

    beforeAll(async () => {
      await page.goto(viteTestUrl + '/zeroJS.html')
    })

    test('zeroJS', async () => {
      expect(await page.$('head script[type=module]')).toBeNull()
    })
  })

  describe('inline entry', () => {
    const _countTags = (selector) => page.$$eval(selector, (t) => t.length)
    const countScriptTags = _countTags.bind(this, 'script[type=module]')
    const countPreloadTags = _countTags.bind(this, 'link[rel=modulepreload]')

    test('is inlined', async () => {
      await page.goto(viteTestUrl + '/inline/shared-2.html?v=1')
      expect(await countScriptTags()).toBeGreaterThan(1)
      expect(await countPreloadTags()).toBe(0)
    })

    test('is not inlined', async () => {
      await page.goto(viteTestUrl + '/inline/unique.html?v=1')
      expect(await countScriptTags()).toBe(1)
      expect(await countPreloadTags()).toBeGreaterThan(0)
    })

    test('execution order when inlined', async () => {
      await page.goto(viteTestUrl + '/inline/shared-1.html?v=1')
      expect((await page.textContent('#output')).trim()).toBe(
        'dep1 common dep2 dep3 shared',
      )
      await page.goto(viteTestUrl + '/inline/shared-2.html?v=1')
      expect((await page.textContent('#output')).trim()).toBe(
        'dep1 common dep2 dep3 shared',
      )
    })

    test('execution order when not inlined', async () => {
      await page.goto(viteTestUrl + '/inline/unique.html?v=1')
      expect((await page.textContent('#output')).trim()).toBe(
        'dep1 common dep2 unique',
      )
    })
  })
})
describe.runIf(isServe)('SPA fallback', () => {
  test('should serve index.html via page navigation even when path matches file basename', async () => {
    const response = await page.goto(viteTestUrl + '/test')
    expect(response.status()).toBe(200)
    const content = await page.content()
    expect(content).toContain('Transformed')
    expect(content).not.toContain('This is test.js')
  })
})
describe.runIf(!isBundled)('invalid', () => {
  test('should be 500 with overlay', async () => {
    const response = await page.goto(viteTestUrl + '/invalid.html')
    expect(response.status()).toBe(500)

    const errorOverlay = await page.waitForSelector('vite-error-overlay')
    expect(errorOverlay).toBeTruthy()

    const message = await errorOverlay.$$eval('.message-body', (m) => {
      return m[0].innerHTML
    })
    expect(message).toContain('Unable to parse HTML')
  })

  test('should close overlay when clicked away', async () => {
    await page.goto(viteTestUrl + '/invalidClick.html')
    const errorOverlay = await page.waitForSelector('vite-error-overlay')
    expect(errorOverlay).toBeTruthy()

    await page.click('html')
    const isVisibleOverlay = await errorOverlay.isVisible()
    expect(isVisibleOverlay).toBeFalsy()
  })

  test('should close overlay when escape key is pressed', async () => {
    await page.goto(viteTestUrl + '/invalidEscape.html')
    const errorOverlay = await page.waitForSelector('vite-error-overlay')
    expect(errorOverlay).toBeTruthy()

    await page.keyboard.press('Escape')
    const isVisibleOverlay = await errorOverlay.isVisible()
    expect(isVisibleOverlay).toBeFalsy()
  })

  test('stack is updated', async () => {
    await page.goto(viteTestUrl + '/invalid.html')

    const errorOverlay = await page.waitForSelector('vite-error-overlay')
    const hiddenPromise = errorOverlay.waitForElementState('hidden')
    await page.keyboard.press('Escape')
    await hiddenPromise

    viteServer.environments.client.hot.send({
      type: 'error',
      err: {
        message: 'someError',
        stack: [
          'Error: someError',
          '    at someMethod (/some/file.ts:1:2)',
        ].join('\n'),
      },
    })
    const newErrorOverlay = await page.waitForSelector('vite-error-overlay')
    const stack = await newErrorOverlay.$$eval('.stack', (m) => m[0].innerHTML)
    expect(stack).toMatch(/^Error: someError/)
  })

  test('should reload when fixed', async () => {
    await untilBrowserLogAfter(
      () => page.goto(viteTestUrl + '/invalid.html'),
      /connected/, // wait for HMR connection
    )
    editFile('invalid.html', (content) => {
      return content.replace('<div Bad', '<div> Good')
    })
    const content = await page.waitForSelector('text=Good HTML')
    expect(content).toBeTruthy()
  })
})
describe.runIf(!isBundled)('warmup', () => {
  test('should warmup /warmup/warm.js', async () => {
    // warmup transform files async during server startup, so the module check
    // here might take a while to load
    await expect
      .poll(() =>
        viteServer.environments.client.moduleGraph.getModuleByUrl(
          '/warmup/warm.js',
        ),
      )
      .toBeTruthy()
  })
})
test.runIf(isServe)(
  'malformed URLs in src attributes should show errors',
  async () => {
    serverLogs.length = 0
    await page.goto(`${viteTestUrl}/malformed-url.html`)
    expect(await page.textContent('.status')).toContain(
      'Page loaded successfully',
    )
    expect(serverLogs).not.toEqual(
      expect.arrayContaining([
        expect.stringMatching('Internal server error: URI malformed'),
      ]),
    )
  },
)