import {describe, expect, it} from 'vitest';
import path from 'path';
import {loadSiteFixture} from './testUtils';


describe('loadSite', () => {

  describe('simple-site-with-baseUrl', () => {
    const siteFixture = 'loadSiteFixtures/simple-site-with-baseUrl';

    // ── TARGET TEST ─────────────────────────────────
    it('loads site - custom config', async () => {
          const site = await loadSiteFixture(siteFixture, {
            config: 'docusaurus.config.custom.js',
          });
          expect(site.props).toMatchSnapshot();
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});