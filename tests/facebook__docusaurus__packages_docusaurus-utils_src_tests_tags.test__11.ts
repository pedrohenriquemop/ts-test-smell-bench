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
  it('does not throw when docs has valid tags', () => {
      const frontmatter = ['open'];
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
          source: 'wrong.md',
          options: {
            onInlineTags: 'throw',
            tags: 'tags.yml',
          },
        });
      expect(testFn).not.toThrow();
    })
  // ── END TARGET TEST ─────────────────────────────
});