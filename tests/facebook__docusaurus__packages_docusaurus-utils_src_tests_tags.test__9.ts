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
  it('ignore when docs has invalid tags', () => {
      using error = vi.spyOn(console, 'error');
      using warn = vi.spyOn(console, 'warn');
      using log = vi.spyOn(console, 'log');

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
        options: {onInlineTags: 'ignore', tags: 'tags.yml'},
      });
      expect(error).not.toHaveBeenCalled();
      expect(warn).not.toHaveBeenCalled();
      expect(log).not.toHaveBeenCalled();

      error.mockRestore();
      warn.mockRestore();
      log.mockRestore();
    })
  // ── END TARGET TEST ─────────────────────────────
});