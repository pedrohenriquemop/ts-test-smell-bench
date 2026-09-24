import {describe, expect, it} from 'vitest';
import flat from '../flat';


describe('flat', () => {

  // ── TARGET TEST ─────────────────────────────────
  it('empty object', () => {
      expect(
        flat({
          foo: {
            bar: {},
          },
        }),
      ).toEqual({
        'foo.bar': {},
      });
    })
  // ── END TARGET TEST ─────────────────────────────
});