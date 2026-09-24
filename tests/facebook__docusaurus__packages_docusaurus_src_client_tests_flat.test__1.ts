import {describe, expect, it} from 'vitest';
import flat from '../flat';


describe('flat', () => {

  // ── TARGET TEST ─────────────────────────────────
  it('primitives', () => {
      const primitives = {
        String: 'good morning',
        Number: 1234.99,
        Boolean: true,
        Date: new Date(),
        null: null,
        undefined,
      };
      (Object.keys(primitives) as (keyof typeof primitives)[]).forEach((key) => {
        const value = primitives[key];
        expect(
          flat({
            foo: {
              bar: value as string,
            },
          }),
        ).toEqual({
          'foo.bar': value,
        });
      });
    })
  // ── END TARGET TEST ─────────────────────────────
});