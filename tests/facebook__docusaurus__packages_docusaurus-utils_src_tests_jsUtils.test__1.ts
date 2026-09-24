import {describe, expect, it, vi} from 'vitest';
import _ from 'lodash';
import {mapAsyncSequential, findAsyncSequential} from '../jsUtils';


describe('findAsyncSequential', () => {
  function sleep(timeout: number): Promise<void> {
      return new Promise((resolve) => {
        setTimeout(resolve, timeout);
      });
    }

  // ── TARGET TEST ─────────────────────────────────
  it('finds sequentially', async () => {
      const items = ['1', '2', '3'];

      const findFn = vi.fn(async (item: string) => {
        await sleep(400);
        return item === '2';
      });

      const timeBefore = Date.now();
      await expect(findAsyncSequential(items, findFn)).resolves.toBe('2');
      const timeAfter = Date.now();

      expect(findFn).toHaveBeenCalledTimes(2);
      expect(findFn).toHaveBeenNthCalledWith(1, '1');
      expect(findFn).toHaveBeenNthCalledWith(2, '2');

      const timeTotal = timeAfter - timeBefore;
      expect(timeTotal).toBeGreaterThanOrEqual(600);
      expect(timeTotal).toBeLessThan(1000);
    })
  // ── END TARGET TEST ─────────────────────────────
});