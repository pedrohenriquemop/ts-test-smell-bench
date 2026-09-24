import {describe, expect, it, vi} from 'vitest';
import {
  reportInlineTags,
  groupTaggedItems,
  getTagVisibility,
} from '@docusaurus/utils';
import {normalizeTag} from '../tags';
import type {Tag, TagMetadata, FrontMatterTag, TagsFile} from '../tags';


describe('getTagVisibility', () => {
  type Item = {id: string; unlisted: boolean};
  function isUnlisted(item: Item): boolean {
      return item.unlisted;
    }
  const item1: Item = {id: '1', unlisted: false};
  const item2: Item = {id: '2', unlisted: true};
  const item3: Item = {id: '3', unlisted: false};
  const item4: Item = {id: '4', unlisted: true};

  // ── TARGET TEST ─────────────────────────────────
  it('works for all unlisted', () => {
      expect(
        getTagVisibility({
          items: [item2, item4],
          isUnlisted,
        }),
      ).toEqual({
        listedItems: [item2, item4],
        unlisted: true,
      });
    })
  // ── END TARGET TEST ─────────────────────────────
});