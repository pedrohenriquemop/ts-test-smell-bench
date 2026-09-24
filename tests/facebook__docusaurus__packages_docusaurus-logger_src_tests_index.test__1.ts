import {afterAll, beforeAll, describe, expect, it, vi} from 'vitest';
import logger from '../index';


describe('logger', () => {
  beforeAll(() => {
      vi.stubEnv('FORCE_COLOR', '3');
    });
  afterAll(() => {
      vi.unstubAllEnvs();
    });

  describe('formatters', () => {

    // ── TARGET TEST ─────────────────────────────────
    it('url', () => {
          expect(
            logger.url('https://docusaurus.io/keepAnsi'),
          ).toMatchInlineSnapshot(
            `"<cyan><underline>https://docusaurus.io/keepAnsi</underline></color>"`,
          );
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});