import {afterAll, beforeAll, describe, expect, it, vi} from 'vitest';
import logger from '../index';


describe('logger', () => {
  beforeAll(() => {
      vi.stubEnv('FORCE_COLOR', '3');
    });
  afterAll(() => {
      vi.unstubAllEnvs();
    });

  describe('interpolate', () => {

    // ── TARGET TEST ─────────────────────────────────
    it('interpolates arrays with flags', () => {
          expect(
            logger.interpolate`(keepAnsi) The following commands are available:code=${[
              'docusaurus start',
              'docusaurus build',
              'docusaurus deploy',
            ]}`,
          ).toMatchInlineSnapshot(`
          "(keepAnsi) The following commands are available:
          - <cyan>\`docusaurus start\`</color>
          - <cyan>\`docusaurus build\`</color>
          - <cyan>\`docusaurus deploy\`</color>"
        `);
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});