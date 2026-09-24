import {describe, expect, it} from 'vitest';
import path from 'path';
import {loadSiteConfig} from '../config';


describe('loadSiteConfig', () => {
  const siteDir = path.join(__dirname, '__fixtures__', 'config');

  // ── TARGET TEST ─────────────────────────────────
  it('website with ts + js config', async () => {
      const config = await loadSiteConfig({
        siteDir: path.join(
          __dirname,
          '__fixtures__',
          'config/sites/ts-and-js-site',
        ),
      });
      expect(config).toMatchSnapshot();
      // Docusaurus uses in priority a TS config
      expect(config.siteConfig.title).toBe('TS title');
      expect(config).not.toEqual({});
    })
  // ── END TARGET TEST ─────────────────────────────
});