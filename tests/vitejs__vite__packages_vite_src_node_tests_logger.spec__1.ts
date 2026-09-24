import { stripVTControlCharacters } from 'node:util'
import { describe, expect, test } from 'vitest'
import { printServerUrls } from '../logger'
import type { ResolvedServerUrls } from '../server'

function collectServerUrls(urls: ResolvedServerUrls): string {
  const messages: string[] = []
  printServerUrls(urls, undefined, (msg) =>
    messages.push(stripVTControlCharacters(msg)),
  )
  return '\n' + messages.join('\n') + '\n'
}

describe('printServerUrls', () => {

  // ── TARGET TEST ─────────────────────────────────
  test('aligns interface names into a column', () => {
      const messages = collectServerUrls({
        local: [],
        network: ['http://172.18.0.1:5173/', 'http://10.0.0.2:5173/'],
        networkInterfaceNames: ['eth0', 'wlan0'],
      })
      expect(messages).toMatchSnapshot()
    })
  // ── END TARGET TEST ─────────────────────────────
});