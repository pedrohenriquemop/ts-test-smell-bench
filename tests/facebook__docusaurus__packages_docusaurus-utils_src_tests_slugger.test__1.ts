import {describe, expect, it} from 'vitest';
import {createSlugger} from '../slugger';


describe('createSlugger', () => {

  // ── TARGET TEST ─────────────────────────────────
  it('can create unique slugs respecting case', () => {
      const slugger = createSlugger();
      const opt = {maintainCase: true};
      expect(slugger.slug('Some$/vaLue$!^', opt)).toBe('SomevaLue');
      expect(slugger.slug('Some$/vaLue$!^', opt)).toBe('SomevaLue-1');
      expect(slugger.slug('Some$/vaLue$!^', opt)).toBe('SomevaLue-2');
      expect(slugger.slug('Some$/vaLue$!^-1', opt)).toBe('SomevaLue-1-1');
    })
  // ── END TARGET TEST ─────────────────────────────
});