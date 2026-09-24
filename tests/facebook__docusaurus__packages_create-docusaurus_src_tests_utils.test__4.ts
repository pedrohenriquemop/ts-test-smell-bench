import {describe, expect, it} from 'vitest';
import {siteNameToPackageName} from '../utils';


describe('siteNameToPackageName', () => {

  // ── TARGET TEST ─────────────────────────────────
  it('skips !!!', () => {
      expect(siteNameToPackageName('!!!')).toEqual('!!!');
    })
  // ── END TARGET TEST ─────────────────────────────
});