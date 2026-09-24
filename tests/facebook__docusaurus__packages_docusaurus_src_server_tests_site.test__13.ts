import {describe, expect, it} from 'vitest';
import path from 'path';
import {loadSiteFixture} from './testUtils';


describe('loadSite', () => {

  describe('custom-i18n-site', () => {

    // ── TARGET TEST ─────────────────────────────────
    it('loads site', async () => {
          const site = await loadSiteFixture('custom-i18n-site');

          expect(site.props).toMatchSnapshot();
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});