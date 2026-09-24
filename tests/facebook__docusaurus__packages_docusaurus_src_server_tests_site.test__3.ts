import {describe, expect, it} from 'vitest';
import path from 'path';
import {loadSiteFixture} from './testUtils';


describe('loadSite', () => {

  describe('simple-site-with-baseUrl', () => {
    const siteFixture = 'loadSiteFixtures/simple-site-with-baseUrl';

    // ── TARGET TEST ─────────────────────────────────
    it('loads site - non-existing config', async () => {
          await expect(() =>
            loadSiteFixture(siteFixture, {
              config: 'docusaurus.config.doesNotExist.js',
            }),
          ).rejects.toThrowErrorMatchingInlineSnapshot(
            `[Error: Config file at "<PROJECT_ROOT>/packages/docusaurus/src/server/__tests__/__fixtures__/loadSiteFixtures/simple-site-with-baseUrl/docusaurus.config.doesNotExist.js" not found.]`,
          );
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});