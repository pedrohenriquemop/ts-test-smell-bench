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
  it('warn when docs has invalid tags', () => {
      using warn = vi.spyOn(console, 'warn');

      reportInlineTags({
        tags: [
          {
            label: 'hello',
            permalink: 'hello',
            inline: false,
            description: undefined,
          },
          {
            label: 'world',
            permalink: 'world',
            inline: true,
            description: undefined,
          },
        ],
        source: 'wrong.md',
        options: {onInlineTags: 'warn', tags: 'tags.yml'},
      });
      expect(warn).toHaveBeenCalledTimes(1);
      expect(warn.mock.calls).toMatchInlineSnapshot(`
        [
          [
            "[WARNING] Tags [world] used in wrong.md are not defined in tags.yml",
          ],
        ]
      `);

      warn.mockRestore();
    })
  // ── END TARGET TEST ─────────────────────────────
});