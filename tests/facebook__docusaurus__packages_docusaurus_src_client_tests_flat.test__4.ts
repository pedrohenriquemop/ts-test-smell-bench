import {describe, expect, it} from 'vitest';
import flat from '../flat';


describe('flat', () => {

  // ── TARGET TEST ─────────────────────────────────
  it('array', () => {
      expect(
        flat({
          hello: [{world: {again: 'foo'}}, {lorem: 'ipsum'}],
        }),
      ).toEqual({
        'hello.0.world.again': 'foo',
        'hello.1.lorem': 'ipsum',
      });
    })
  // ── END TARGET TEST ─────────────────────────────
});