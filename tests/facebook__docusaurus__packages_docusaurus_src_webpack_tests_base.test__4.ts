import {describe, expect, it} from 'vitest';
import path from 'path';
import _ from 'lodash';
import webpack from 'webpack';
import {posixPath} from '@docusaurus/utils';
import {excludeJS, clientDir, createBaseConfig} from '../base';
import {
  DEFAULT_FASTER_CONFIG,
  DEFAULT_FUTURE_CONFIG,
} from '../../server/configValidation';
import {createConfigureWebpackUtils} from '../configure';
import type {Props} from '@docusaurus/types';

function createTestConfigureWebpackUtils() {
  return createConfigureWebpackUtils({
    siteConfig: {webpack: {jsLoader: 'babel'}, future: DEFAULT_FUTURE_CONFIG},
  });
}

describe('base webpack config', () => {
  const props = {
      outDir: '',
      siteDir: path.resolve(__dirname, '__fixtures__', 'base_test_site'),
      siteConfig: {staticDirectories: ['static'], future: DEFAULT_FUTURE_CONFIG},
      baseUrl: '',
      generatedFilesDir: '',
      routesPaths: [''],
      i18n: {
        currentLocale: 'en',
      },
      siteMetadata: {
        docusaurusVersion: '2.0.0-alpha.70',
      },
      currentBundler: {name: 'webpack', instance: webpack},
      plugins: [
        {
          getThemePath() {
            return path.resolve(
              __dirname,
              '__fixtures__',
              'base_test_site',
              'pluginThemeFolder',
            );
          },
        },
        {
          getThemePath() {
            return path.resolve(
              __dirname,
              '__fixtures__',
              'base_test_site',
              'secondPluginThemeFolder',
            );
          },
        },
      ],
    } as Props;

  // ── TARGET TEST ─────────────────────────────────
  it('creates webpack aliases', async () => {
      const aliases = ((
        await createBaseConfig({
          props,
          isServer: true,
          minify: true,
          faster: DEFAULT_FASTER_CONFIG,
          configureWebpackUtils: await createTestConfigureWebpackUtils(),
        })
      ).resolve?.alias ?? {}) as {[alias: string]: string};
      // Make aliases relative so that test work on all computers
      const relativeAliases = _.mapValues(aliases, (a) =>
        posixPath(path.relative(props.siteDir, a)),
      );
      expect(relativeAliases).toMatchSnapshot();
    })
  // ── END TARGET TEST ─────────────────────────────
});