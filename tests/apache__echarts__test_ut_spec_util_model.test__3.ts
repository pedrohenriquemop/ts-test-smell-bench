import { compressBatches, removeDuplicates } from '@/src/util/model';


describe('util/model', () => {

  describe('compressBatches', () => {
    function item(seriesId: number | string, dataIndex: number | number[]) {
                return {seriesId, dataIndex};
            }

    describe('removeDuplicates', () => {
      type Item1 = {
                      name: string;
                      name2?: string;
                      extraNum?: number;
                  };
      type Item2 = {
                      value: number;
                  };

      // ── TARGET TEST ─────────────────────────────────
      it('removeDuplicates_priority', function () {
                      const arr: Item1[] = [
                          {name: 'y', extraNum: 100},
                          {name: 'b', extraNum: 101},
                          {name: 'y', extraNum: 102},
                          {name: 't', extraNum: 103},
                          {name: 'y', extraNum: 104},
                          {name: 'z', extraNum: 105},
                          {name: 't', extraNum: 106},
                      ];
                      removeDuplicates(arr, item => item.name, null);
                      expect(arr.length).toEqual(4);
                      expect(arr.map(item => item.name)).toEqual(['y', 'b', 't', 'z']);
                      expect(arr.map(item => item.extraNum)).toEqual([100, 101, 103, 105]);
                  })
      // ── END TARGET TEST ─────────────────────────────
    });
  });
});