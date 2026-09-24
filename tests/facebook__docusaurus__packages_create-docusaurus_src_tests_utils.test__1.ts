import {describe, expect, it} from 'vitest';
import {siteNameToPackageName} from '../utils';


describe('siteNameToPackageName', () => {

  // ── TARGET TEST ─────────────────────────────────
  it('converts ñ', () => {
      expect(siteNameToPackageName('mañanaFoo')).toEqual('ma-ana-foo');
    })
  // ── END TARGET TEST ─────────────────────────────
});