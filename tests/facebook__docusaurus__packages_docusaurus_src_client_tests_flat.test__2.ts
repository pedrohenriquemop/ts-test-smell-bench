import {describe, expect, it} from 'vitest';
import flat from '../flat';


describe('flat', () => {

  // ── TARGET TEST ─────────────────────────────────
  it('multiple keys', () => {
      expect(
        flat({
          foo: {
            bar: 'baz',
            endi: 'lie',
          },
        }),
      ).toEqual({
        'foo.bar': 'baz',
        'foo.endi': 'lie',
      });
    })
  // ── END TARGET TEST ─────────────────────────────
});