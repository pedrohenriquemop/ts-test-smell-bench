import {describe, expect, it} from 'vitest';
import flat from '../flat';


describe('flat', () => {

  // ── TARGET TEST ─────────────────────────────────
  it('nested', () => {
      expect(
        flat({
          foo: {
            bar: {
              baz: 'lorem ipsum',
            },
          },
        }),
      ).toEqual({
        'foo.bar.baz': 'lorem ipsum',
      });

      expect(
        flat({
          foo: {
            bar: 'baz',
          },
        }),
      ).toEqual({
        'foo.bar': 'baz',
      });
    })
  // ── END TARGET TEST ─────────────────────────────
});