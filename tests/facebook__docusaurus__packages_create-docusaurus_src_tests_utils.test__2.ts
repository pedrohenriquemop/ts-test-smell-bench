import {describe, expect, it} from 'vitest';
import {siteNameToPackageName} from '../utils';


describe('siteNameToPackageName', () => {

  // ── TARGET TEST ─────────────────────────────────
  it('converts __', () => {
      expect(siteNameToPackageName('foo__bar')).toEqual('foo-bar');
    })
  // ── END TARGET TEST ─────────────────────────────
});