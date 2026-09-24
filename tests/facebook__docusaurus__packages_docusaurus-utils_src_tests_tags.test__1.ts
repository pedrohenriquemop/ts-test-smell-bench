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
    it('normalizes complex string tag', () => {
          const input: FrontMatterTag = 'some more Complex_tag';
          const expectedOutput: TagMetadata = {
            inline: true,
            label: 'some more Complex_tag',
            permalink: `${tagsBaseRoutePath}/some-more-complex-tag`,
            description: undefined,
          };
          expect(
            normalizeTag({tagsBaseRoutePath, tagsFile: null, tag: input}),
          ).toEqual(expectedOutput);
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});