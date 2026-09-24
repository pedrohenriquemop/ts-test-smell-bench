import {describe, expect, it} from 'vitest';
import path from 'path';
import {loadSiteFixture} from './testUtils';


describe('loadSite', () => {

  describe('simple-site-with-baseUrl-i18n', () => {
    const siteFixture = 'loadSiteFixtures/simple-site-with-baseUrl-i18n';

    // ── TARGET TEST ─────────────────────────────────
    it('loads site - locale fr', async () => {
          const site = await loadSiteFixture(siteFixture, {
            locale: 'fr',
          });
          expect(site.props).toMatchSnapshot();
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});