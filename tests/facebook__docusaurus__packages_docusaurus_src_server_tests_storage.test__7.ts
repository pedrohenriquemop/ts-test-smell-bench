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

  describe('namespace', () => {

    describe('true', () => {
      function testAutomaticNamespace(
              {
                url,
                baseUrl,
              }: {
                url: string;
                baseUrl: string;
              },
              expectedNamespace: string,
            ) {
              return expect(test({url, baseUrl, storage: {namespace: true}})).toEqual(
                expect.objectContaining({namespace: expectedNamespace}),
              );
            }

      // ── TARGET TEST ─────────────────────────────────
      it('automatic namespace - is not slash sensitive', () => {
              const expectedNamespace = '-b21';
              testAutomaticNamespace(
                {
                  url: 'https://docusaurus.io',
                  baseUrl: '/baseUrl/',
                },
                expectedNamespace,
              );
              testAutomaticNamespace(
                {
                  url: 'https://docusaurus.io/',
                  baseUrl: '/baseUrl/',
                },
                expectedNamespace,
              );
              testAutomaticNamespace(
                {
                  url: 'https://docusaurus.io/',
                  baseUrl: '/baseUrl',
                },
                expectedNamespace,
              );
              testAutomaticNamespace(
                {
                  url: 'https://docusaurus.io',
                  baseUrl: 'baseUrl',
                },
                expectedNamespace,
              );
            })
      // ── END TARGET TEST ─────────────────────────────
    });
  });
});