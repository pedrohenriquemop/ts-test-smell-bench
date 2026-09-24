import {describe, expect, it} from 'vitest';
import {toggleListItem} from '../jsUtils';


describe('toggleListItem', () => {

  // ── TARGET TEST ─────────────────────────────────
  it('appends item not in list', () => {
      expect(toggleListItem([1, 2], 3)).toEqual([1, 2, 3]);
    })
  // ── END TARGET TEST ─────────────────────────────
});