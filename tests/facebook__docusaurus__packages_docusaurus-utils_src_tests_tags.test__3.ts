import {describe, expect, it, vi} from 'vitest';
import {
  reportInlineTags,
  groupTaggedItems,
  getTagVisibility,
} from '@docusaurus/utils';
import {normalizeTag} from '../tags';
import type {Tag, TagMetadata, FrontMatterTag, TagsFile} from '../tags';


describe('normalizeTag', () => {
  const tagsBaseRoutePath = '/all/tags';

  describe('inline', () => {

    // ── TARGET TEST ─────────────────────────────────
    it('normalizes complex string tag with object tag', () => {
          const input: FrontMatterTag = {
            label: 'tag complex Label',
            permalink: '/MoreComplex/Permalink',
          };
          const expectedOutput: TagMetadata = {
            inline: true,
            label: 'tag complex Label',
            permalink: `${tagsBaseRoutePath}/MoreComplex/Permalink`,
            description: undefined,
          };
          expect(
            normalizeTag({tagsBaseRoutePath, tagsFile: null, tag: input}),
          ).toEqual(expectedOutput);
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});