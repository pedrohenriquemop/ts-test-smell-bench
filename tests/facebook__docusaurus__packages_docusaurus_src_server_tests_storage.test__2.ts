import {describe, expect, it} from 'vitest';
import {createSiteStorage} from '../storage';
import {DEFAULT_STORAGE_CONFIG} from '../configValidation';
import type {StorageConfig, SiteStorage} from '@docusaurus/types';

function test({
  url = 'https://docusaurus.io',
  baseUrl = '/',
  storage = {},
}: {
  url?: string;
  baseUrl?: string;
  storage?: Partial<StorageConfig>;
}): SiteStorage {
  return createSiteStorage({
    url,
    baseUrl,
    storage: {
      ...DEFAULT_STORAGE_CONFIG,
      ...storage,
    },
  });
}
const DefaultSiteStorage: SiteStorage = {
  type: 'localStorage',
  namespace: '',
};

describe('storage', () => {

  describe('type', () => {

    // ── TARGET TEST ─────────────────────────────────
    it('sessionStorage', () => {
          expect(test({storage: {type: 'sessionStorage'}})).toEqual({
            ...DefaultSiteStorage,
            type: 'sessionStorage',
          });
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});