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

  describe('with tags file', () => {
    const tagsFile: TagsFile = {
          tag1: {
            label: 'Tag 1 label',
            permalink: 'tag-1-permalink',
            description: 'Tag 1 description',
          },
          tag2: {
            label: 'Tag 2 label',
            permalink: '/tag-2-permalink',
            description: undefined,
          },
        };

    // ── TARGET TEST ─────────────────────────────────
    it('normalizes tag1 ref', () => {
          const input: FrontMatterTag = 'tag1';
          const expectedOutput: TagMetadata = {
            inline: false,
            label: tagsFile.tag1.label,
            description: tagsFile.tag1.description,
            permalink: `${tagsBaseRoutePath}/tag-1-permalink`,
          };
          expect(normalizeTag({tagsBaseRoutePath, tagsFile, tag: input})).toEqual(
            expectedOutput,
          );
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});