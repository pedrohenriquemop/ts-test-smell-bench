import {describe, expect, it} from 'vitest';
import path from 'path';
import {base64} from '../lqip';

const imgPath = path.join(__dirname, '__fixtures__', 'endi.jpg');
const invalidPath = path.join(__dirname, '__fixtures__', 'docusaurus.svg');

describe('base64', () => {

  // ── TARGET TEST ─────────────────────────────────
  it('generates a valid base64', async () => {
      const expectedBase64 = 'data:image/jpeg;base64,/9j/2wBDA';
      await expect(base64(imgPath)).resolves.toContain(expectedBase64);
    })
  // ── END TARGET TEST ─────────────────────────────
});