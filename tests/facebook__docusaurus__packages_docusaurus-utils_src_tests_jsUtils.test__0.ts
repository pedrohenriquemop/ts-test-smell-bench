import {describe, expect, it, vi} from 'vitest';
import _ from 'lodash';
import {mapAsyncSequential, findAsyncSequential} from '../jsUtils';


describe('mapAsyncSequential', () => {
  function sleep(timeout: number): Promise<void> {
      return new Promise((resolve) => {
        setTimeout(resolve, timeout);
      });
    }

  // ── TARGET TEST ─────────────────────────────────
  it('maps sequentially', async () => {
      const itemToTimeout: {[key: string]: number} = {
        '1': 200,
        '2': 600,
        '3': 400,
      };
      const items = Object.keys(itemToTimeout);

      const itemMapStartsAt: {[key: string]: number} = {};
      const itemMapEndsAt: {[key: string]: number} = {};

      const timeBefore = Date.now();
      await expect(
        mapAsyncSequential(items, async (item) => {
          const itemTimeout = itemToTimeout[item]!;
          itemMapStartsAt[item] = Date.now();
          await sleep(itemTimeout);
          itemMapEndsAt[item] = Date.now();
          return `${item} mapped`;
        }),
      ).resolves.toEqual(['1 mapped', '2 mapped', '3 mapped']);
      const timeAfter = Date.now();

      const timeTotal = timeAfter - timeBefore;

      const totalTimeouts = _.sum(Object.values(itemToTimeout));
      expect(timeTotal).toBeGreaterThanOrEqual(totalTimeouts - 100);

      expect(itemMapStartsAt[1]).toBeGreaterThanOrEqual(0);
      expect(itemMapStartsAt[2]).toBeGreaterThanOrEqual(itemMapEndsAt[1]! - 100);
      expect(itemMapStartsAt['3']).toBeGreaterThanOrEqual(
        itemMapEndsAt[2]! - 100,
      );
    })
  // ── END TARGET TEST ─────────────────────────────
});