import {describe, expect, it} from 'vitest';
import {toggleListItem} from '../jsUtils';


describe('toggleListItem', () => {

  // ── TARGET TEST ─────────────────────────────────
  it('removes item already in list', () => {
      expect(toggleListItem([1, 2, 3], 2)).toEqual([1, 3]);
    })
  // ── END TARGET TEST ─────────────────────────────
});