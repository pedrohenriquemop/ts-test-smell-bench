import {describe, expect, it} from 'vitest';
import path from 'path';
import {loadSiteFixture} from './testUtils';


describe('loadSite', () => {

  describe('simple-site-with-baseUrl', () => {
    const siteFixture = 'loadSiteFixtures/simple-site-with-baseUrl';

    // ── TARGET TEST ─────────────────────────────────
    it('loads site - custom outDir', async () => {
          const site = await loadSiteFixture(siteFixture, {
            outDir: 'custom-out-dir',
          });
          expect(site.props).toMatchSnapshot();
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});