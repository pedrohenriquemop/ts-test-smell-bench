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
      it('removeDuplicates_edges_cases', function () {
                      function run(inputArr: Item2[], expectArr: Item2[]): void {
                          removeDuplicates(inputArr, (item: Item2) => item.value + '', null);
                          expect(inputArr).toEqual(expectArr);
                      }

                      run(
                          [],
                          []
                      );
                      run(
                          [
                              {value: 1},
                          ],
                          [
                              {value: 1}
                          ]
                      );
                      run(
                          [
                              { value: 1 },
                              { value: 2 },
                              { value: 3 }
                          ],
                          [
                              { value: 1 },
                              { value: 2 },
                              { value: 3 }
                          ],
                      );
                      run(
                          [
                              { value: 1 },
                              { value: 2 },
                              { value: 2 },
                              { value: 3 }
                          ],
                          [
                              { value: 1 },
                              { value: 2 },
                              { value: 3 }
                          ],
                      );
                      run(
                          [
                              { value: 1 },
                              { value: 1 },
                              { value: 2 }
                          ],
                          [
                              { value: 1 },
                              { value: 2 }
                          ],
                      );
                      run(
                          [
                              { value: 1 },
                              { value: 2 },
                              { value: 2 }
                          ],
                          [
                              { value: 1 },
                              { value: 2 }
                          ],
                      );
                      run(
                          [
                              { value: 2 },
                              { value: 2 },
                              { value: 2 }
                          ],
                          [
                              { value: 2 }
                          ],
                      );
                      run(
                          [
                              { value: 5 },
                              { value: 5 }
                          ],
                          [
                              { value: 5 },
                          ],
                      );

                  })
      // ── END TARGET TEST ─────────────────────────────
    });
  });
});