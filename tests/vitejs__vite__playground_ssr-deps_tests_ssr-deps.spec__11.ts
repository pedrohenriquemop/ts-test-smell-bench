import { describe, expect, test } from 'vitest'
import { editFile, getColor, isServe, page } from '~utils'
import { port } from './serve'

const url = `http://localhost:${port}`

// ── TARGET TEST ─────────────────────────────────
test('msg from optimized cjs with nested external', async () => {
  await page.goto(url)
  expect(await page.textContent('.optimized-cjs-with-nested-external')).toMatch(
    'Hello World!',
  )
})
// ── END TARGET TEST ─────────────────────────────
describe.runIf(isServe)('hmr', () => {
  // TODO: the server file is not imported on the client at all
  // so it's not present in the client moduleGraph anymore
  // we need to decide if we want to support a usecase when ssr change
  // affects the client in any way
  test.skip('handle isomorphic module updates', async () => {
    await page.goto(url)

    expect(await page.textContent('.isomorphic-module-server')).toMatch(
      '[server]',
    )
    // Allowing additional time for this element to be filled in
    // by a client script that is loaded using dynamic import
    await expect
      .poll(async () => {
        return page.textContent('.isomorphic-module-browser')
      })
      .toMatch('[browser]')

    editFile('src/isomorphic-module-browser.js', (code) =>
      code.replace('[browser]', '[browser-hmr]'),
    )
    await page.waitForNavigation()
    await expect
      .poll(async () => {
        return page.textContent('.isomorphic-module-browser')
      })
      .toMatch('[browser-hmr]')

    editFile('src/isomorphic-module-server.js', (code) =>
      code.replace('[server]', '[server-hmr]'),
    )
    await page.waitForNavigation()
    await expect
      .poll(async () => {
        return page.textContent('.isomorphic-module-server')
      })
      .toMatch('[server-hmr]')
  })
})