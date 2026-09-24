import {describe, it} from 'vitest';
import webpack from 'webpack';
import {createBuildClientConfig, createStartClientConfig} from '../client';
import {loadSiteFixture} from '../../server/__tests__/testUtils';
import {createConfigureWebpackUtils} from '../configure';
import {
  DEFAULT_FASTER_CONFIG,
  DEFAULT_FUTURE_CONFIG,
} from '../../server/configValidation';

function createTestConfigureWebpackUtils() {
  return createConfigureWebpackUtils({
    siteConfig: {webpack: {jsLoader: 'babel'}, future: DEFAULT_FUTURE_CONFIG},
  });
}

describe('webpack dev config', () => {

  // ── TARGET TEST ─────────────────────────────────
  it('simple build', async () => {
      const {props} = await loadSiteFixture('simple-site');
      const {config} = await createBuildClientConfig({
        props,
        faster: DEFAULT_FASTER_CONFIG,
        configureWebpackUtils: await createTestConfigureWebpackUtils(),
        minify: false,
        bundleAnalyzer: false,
      });
      webpack.validate(config);
    })
  // ── END TARGET TEST ─────────────────────────────
});