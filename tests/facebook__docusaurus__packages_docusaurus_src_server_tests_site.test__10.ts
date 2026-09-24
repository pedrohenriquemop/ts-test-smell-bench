import {describe, expect, it} from 'vitest';
import path from 'path';
import {loadSiteFixture} from './testUtils';


describe('loadSite', () => {

  describe('simple-site-with-baseUrl-i18n', () => {
    const siteFixture = 'loadSiteFixtures/simple-site-with-baseUrl-i18n';

    // ── TARGET TEST ─────────────────────────────────
    it('uses locale url in site config', async () => {
          const site = await loadSiteFixture(siteFixture, {
            locale: 'es',
          });
          expect(site.props.siteConfig.url).toBe('https://es.docusaurus.io');
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});