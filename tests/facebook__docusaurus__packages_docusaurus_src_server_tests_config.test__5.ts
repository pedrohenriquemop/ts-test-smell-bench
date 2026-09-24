import {describe, expect, it} from 'vitest';
import path from 'path';
import {loadSiteConfig} from '../config';


describe('loadSiteConfig', () => {
  const siteDir = path.join(__dirname, '__fixtures__', 'config');

  // ── TARGET TEST ─────────────────────────────────
  it('website with valid async config creator function', async () => {
      const config = await loadSiteConfig({
        siteDir,
        customConfigFilePath: 'createConfigAsync.config.js',
      });
      expect(config).toMatchSnapshot();
      expect(config).not.toEqual({});
    })
  // ── END TARGET TEST ─────────────────────────────
});