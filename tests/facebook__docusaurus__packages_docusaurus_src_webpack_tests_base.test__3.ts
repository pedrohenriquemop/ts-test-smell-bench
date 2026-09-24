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

describe('babel transpilation exclude logic', () => {

  // ── TARGET TEST ─────────────────────────────────
  it('does not transpile node_modules', () => {
      const moduleFiles = [
        'node_modules/react-toggle.js',
        '/website/node_modules/react-trend/index.js',
        '/docusaurus/website/node_modules/react-super.js',
        '/docusaurus/website/node_modules/@docusaurus/core/node_modules/core-js/modules/_descriptors.js',
        'node_modules/docusaurus-theme-classic/node_modules/react-slick/index.js',
      ];
      moduleFiles.forEach((file) => {
        expect(excludeJS(file)).toBe(true);
      });
    })
  // ── END TARGET TEST ─────────────────────────────
});