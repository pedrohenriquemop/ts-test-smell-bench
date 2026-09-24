import {describe, expect, it, vi} from 'vitest';
import {
  reportInlineTags,
  groupTaggedItems,
  getTagVisibility,
} from '@docusaurus/utils';
import {normalizeTag} from '../tags';
import type {Tag, TagMetadata, FrontMatterTag, TagsFile} from '../tags';


describe('groupTaggedItems', () => {
  type SomeTaggedItem = {
      id: string;
      nested: {
        tags: Tag[];
      };
    };
  function groupItems(items: SomeTaggedItem[]) {
      return groupTaggedItems(items, (item) => item.nested.tags);
    }
  type Input = Parameters<typeof groupItems>[0];
  type Output = ReturnType<typeof groupItems>;

  // ── TARGET TEST ─────────────────────────────────
  it('groups items by tag permalink', () => {
      const tagGuide = {
        label: 'Guide',
        permalink: '/guide',
        description: undefined,
      };
      const tagTutorial = {
        label: 'Tutorial',
        permalink: '/tutorial',
        description: undefined,
      };
      const tagAPI = {label: 'API', permalink: '/api', description: undefined};

      // This one will be grouped under same permalink and label is ignored
      const tagTutorialOtherLabel = {
        label: 'TutorialOtherLabel',
        permalink: '/tutorial',
        description: undefined,
      };

      const item1: SomeTaggedItem = {
        id: '1',
        nested: {
          tags: [
            tagGuide,
            tagTutorial,
            tagAPI,
            // Add some duplicates on purpose: they should be filtered
            tagGuide,
            tagTutorialOtherLabel,
          ],
        },
      };
      const item2: SomeTaggedItem = {
        id: '2',
        nested: {
          tags: [tagAPI],
        },
      };
      const item3: SomeTaggedItem = {
        id: '3',
        nested: {
          tags: [tagTutorial],
        },
      };
      const item4: SomeTaggedItem = {
        id: '4',
        nested: {
          tags: [tagTutorialOtherLabel],
        },
      };

      const input: Input = [item1, item2, item3, item4];

      const expectedOutput: Output = {
        '/guide': {tag: tagGuide, items: [item1]},
        '/tutorial': {tag: tagTutorial, items: [item1, item3, item4]},
        '/api': {tag: tagAPI, items: [item1, item2]},
      };

      expect(groupItems(input)).toEqual(expectedOutput);
    })
  // ── END TARGET TEST ─────────────────────────────
});