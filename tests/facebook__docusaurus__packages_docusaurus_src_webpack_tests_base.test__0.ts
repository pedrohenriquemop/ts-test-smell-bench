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
  it('always transpiles client dir files', () => {
      const clientFiles = [
        'App.js',
        'clientEntry.js',
        'serverEntry.js',
        path.join('exports', 'Link.js'),
      ];
      clientFiles.forEach((file) => {
        expect(excludeJS(path.join(clientDir, file))).toBe(false);
      });
    })
  // ── END TARGET TEST ─────────────────────────────
});