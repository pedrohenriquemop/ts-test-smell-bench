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
      it('removeDuplicates_resolve1', function () {
                      const countRecord: number[] = [];
                      function resolve1(item: Item1, count: number): void {
                          countRecord.push(count);
                          item.name2 = item.name + (
                              count > 0 ? (count - 1) : ''
                          );
                      }
                      const arr: Item1[] = [
                          {name: 'y'},
                          {name: 'b'},
                          {name: 'y'},
                          {name: 't'},
                          {name: 'y'},
                          {name: 'z'},
                          {name: 't'},
                      ];
                      const arrLengthOriginal = arr.length;
                      const arrNamesOriginal = arr.map(item => item.name);
                      removeDuplicates(arr, item => item.name, resolve1);

                      expect(countRecord).toEqual([0, 0, 1, 0, 2, 0, 1]);
                      expect(arr.length).toEqual(arrLengthOriginal);
                      expect(arr.map(item => item.name)).toEqual(arrNamesOriginal);
                      expect(arr.map(item => item.name2)).toEqual(['y', 'b', 'y0', 't', 'y1', 'z', 't0']);
                  })
      // ── END TARGET TEST ─────────────────────────────
    });
  });
});