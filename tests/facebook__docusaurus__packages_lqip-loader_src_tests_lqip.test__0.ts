import {describe, expect, it} from 'vitest';
import path from 'path';
import {base64} from '../lqip';

const imgPath = path.join(__dirname, '__fixtures__', 'endi.jpg');
const invalidPath = path.join(__dirname, '__fixtures__', 'docusaurus.svg');

describe('base64', () => {

  // ── TARGET TEST ─────────────────────────────────
  it('rejects unknown or unsupported file format', async () => {
      await expect(base64(invalidPath)).rejects.toThrow(
        /Error: Input file is missing or uses unsupported image format, lqip v.*/,
      );
    })
  // ── END TARGET TEST ─────────────────────────────
});