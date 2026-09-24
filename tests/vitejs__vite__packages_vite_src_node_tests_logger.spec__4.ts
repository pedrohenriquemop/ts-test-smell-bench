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
  test('works when networkInterfaceNames is absent', () => {
      const messages = collectServerUrls({
        local: [],
        network: ['http://10.0.0.2:5173/'],
      })
      expect(messages).toMatchSnapshot()
    })
  // ── END TARGET TEST ─────────────────────────────
});