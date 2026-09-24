import {describe, expect, it, vi} from 'vitest';
import {
  reportInlineTags,
  groupTaggedItems,
  getTagVisibility,
} from '@docusaurus/utils';
import {normalizeTag} from '../tags';
import type {Tag, TagMetadata, FrontMatterTag, TagsFile} from '../tags';


describe('reportInlineTags', () => {
  const tagsFile: TagsFile = {
      hello: {
        label: 'Hello',
        permalink: '/hello',
        description: undefined,
      },
      test: {
        label: 'Test',
        permalink: '/test',
        description: undefined,
      },
      open: {
        label: 'Open Source',
        permalink: '/open',
        description: undefined,
      },
    };

  // ── TARGET TEST ─────────────────────────────────
  it('throw for unknown string and object tag', () => {
      const frontmatter = ['open', 'world'];
      const tags = frontmatter.map((tag) =>
        normalizeTag({
          tagsBaseRoutePath: '/tags',
          tagsFile,
          tag,
        }),
      );

      const testFn = () =>
        reportInlineTags({
          tags,
          source: 'default.md',
          options: {
            onInlineTags: 'throw',
            tags: 'tags.yml',
          },
        });
      expect(testFn).toThrowErrorMatchingInlineSnapshot(
        `[Error: Tags [world] used in default.md are not defined in tags.yml]`,
      );
    })
  // ── END TARGET TEST ─────────────────────────────
});