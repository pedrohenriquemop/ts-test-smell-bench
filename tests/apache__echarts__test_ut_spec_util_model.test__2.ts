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
      it('removeDuplicates_no_resolve_has_value', function () {
                      const arr: string[] = [
                          'y',
                          'b',
                          'y',
                          undefined,
                          'y',
                          null,
                          'y',
                          't',
                          'b',
                      ];
                      removeDuplicates(arr, item => item + '', null);
                      expect(arr.length).toEqual(5);
                      expect(arr).toEqual(['y', 'b', undefined, null, 't']);
                  })
      // ── END TARGET TEST ─────────────────────────────
    });
  });
});