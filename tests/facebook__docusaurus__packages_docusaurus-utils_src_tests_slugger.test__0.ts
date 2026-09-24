import {describe, expect, it} from 'vitest';
import {createSlugger} from '../slugger';


describe('createSlugger', () => {

  // ── TARGET TEST ─────────────────────────────────
  it('can create unique slugs', () => {
      const slugger = createSlugger();
      // cSpell:ignore somevalue
      expect(slugger.slug('Some$/vaLue$!^')).toBe('somevalue');
      expect(slugger.slug('Some$/vaLue$!^')).toBe('somevalue-1');
      expect(slugger.slug('Some$/vaLue$!^')).toBe('somevalue-2');
      expect(slugger.slug('Some$/vaLue$!^-1')).toBe('somevalue-1-1');
    })
  // ── END TARGET TEST ─────────────────────────────
});