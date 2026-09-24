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
    it('normalizes simple object tag', () => {
          const input: FrontMatterTag = {
            label: 'tag',
            permalink: 'tagPermalink',
          };
          const expectedOutput: TagMetadata = {
            inline: true,
            label: 'tag',
            permalink: `${tagsBaseRoutePath}/tagPermalink`,
            description: undefined,
          };
          expect(
            normalizeTag({tagsBaseRoutePath, tagsFile: null, tag: input}),
          ).toEqual(expectedOutput);
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});