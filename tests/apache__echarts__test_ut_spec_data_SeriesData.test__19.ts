import SeriesData from '@/src/data/SeriesData';
import Model from '@/src/model/Model';
import { createSourceFromSeriesDataOption, Source, createSource } from '@/src/data/Source';
import { OptionDataItemObject,
    OptionDataValue,
    SOURCE_FORMAT_ARRAY_ROWS,
    SOURCE_FORMAT_OBJECT_ROWS,
    SOURCE_FORMAT_ORIGINAL } from '@/src/util/types';
import SeriesDimensionDefine from '@/src/data/SeriesDimensionDefine';
import OrdinalMeta from '@/src/data/OrdinalMeta';
import DataStore from '@/src/data/DataStore';
import { DefaultDataProvider } from '@/src/data/helper/dataProvider';
import { SeriesDataSchema } from '@/src/data/helper/SeriesDataSchema';

const ID_PREFIX = 'e\0\0';
const NAME_REPEAT_PREFIX = '__ec__';

describe('SeriesData', () => {

  describe('id_and_name', () => {
    function makeOneByOneChecker(list: SeriesData) {
                let getIdDataIndex = 0;
                let getNameDataIndex = 0;

                return {
                    nextIdEqualsTo: function (expectedId: string): void {
                        expect(list.getId(getIdDataIndex)).toEqual(expectedId);
                        getIdDataIndex++;
                    },
                    nextNameEqualsTo: function (expectedName: string): void {
                        expect(list.getName(getNameDataIndex)).toEqual(expectedName);
                        getNameDataIndex++;
                    },
                    currGetIdDataIndex: function (): number {
                        return getIdDataIndex;
                    },
                    currGetNameDataIndex: function (): number {
                        return getNameDataIndex;
                    }
                };
            }

    describe('id_name_declared_sourceFormat_original', () => {

      // ── TARGET TEST ─────────────────────────────────
      it('sourceFormatOriginal', function () {
                      const list = new SeriesData(['x'], new Model());
                      const oneByOne = makeOneByOneChecker(list);

                      list.initData([
                          { value: 0, id: 'myId_10' },
                          { value: 10, id: 555 }, // numeric id.
                          { value: 20, id: '666%' },
                          { value: 30, id: 'myId_good', name: 'b' },
                          { value: 40, name: 'b' },
                          { value: 50, id: null },
                          { value: 60, id: undefined },
                          { value: 70, id: NaN },
                          { value: 80, id: '' },
                          { value: 90, name: 'b' },
                          { value: 100 },
                          { value: 110, id: 'myId_better' },
                          { value: 120, id: 'myId_better' } // duplicated id.
                      ]);

                      oneByOne.nextIdEqualsTo('myId_10');
                      oneByOne.nextIdEqualsTo('555');
                      oneByOne.nextIdEqualsTo('666%');
                      oneByOne.nextIdEqualsTo('myId_good');
                      oneByOne.nextIdEqualsTo('b');
                      oneByOne.nextIdEqualsTo(`${ID_PREFIX}${oneByOne.currGetIdDataIndex()}`);
                      oneByOne.nextIdEqualsTo(`${ID_PREFIX}${oneByOne.currGetIdDataIndex()}`);
                      oneByOne.nextIdEqualsTo('NaN');
                      oneByOne.nextIdEqualsTo('');
                      oneByOne.nextIdEqualsTo(`b${NAME_REPEAT_PREFIX}2`);
                      oneByOne.nextIdEqualsTo(`${ID_PREFIX}${oneByOne.currGetIdDataIndex()}`);
                      oneByOne.nextIdEqualsTo('myId_better');
                      oneByOne.nextIdEqualsTo('myId_better');

                      oneByOne.nextNameEqualsTo('');
                      oneByOne.nextNameEqualsTo('');
                      oneByOne.nextNameEqualsTo('');
                      oneByOne.nextNameEqualsTo('b');
                      oneByOne.nextNameEqualsTo('b');
                      oneByOne.nextNameEqualsTo('');
                      oneByOne.nextNameEqualsTo('');
                      oneByOne.nextNameEqualsTo('');
                      oneByOne.nextNameEqualsTo('');
                      oneByOne.nextNameEqualsTo('b');
                      oneByOne.nextNameEqualsTo('');
                      oneByOne.nextNameEqualsTo('');
                      oneByOne.nextNameEqualsTo('');

                      list.appendData([
                          { value: 200, id: 'myId_best' },
                          { value: 210, id: 999 }, // numeric id.
                          { value: 220, id: '777px' },
                          { value: 230, name: 'b' },
                          { value: 240 }
                      ]);

                      oneByOne.nextIdEqualsTo('myId_best');
                      oneByOne.nextIdEqualsTo('999');
                      oneByOne.nextIdEqualsTo('777px');
                      oneByOne.nextIdEqualsTo(`b${NAME_REPEAT_PREFIX}3`);
                      oneByOne.nextIdEqualsTo(`${ID_PREFIX}${oneByOne.currGetIdDataIndex()}`);

                      oneByOne.nextNameEqualsTo('');
                      oneByOne.nextNameEqualsTo('');
                      oneByOne.nextNameEqualsTo('');
                      oneByOne.nextNameEqualsTo('b');
                      oneByOne.nextNameEqualsTo('');

                      list.appendValues([], ['b', 'c', null]);

                      oneByOne.nextIdEqualsTo(`b${NAME_REPEAT_PREFIX}4`);
                      oneByOne.nextIdEqualsTo('c');
                      oneByOne.nextIdEqualsTo(`${ID_PREFIX}${oneByOne.currGetIdDataIndex()}`);

                      oneByOne.nextNameEqualsTo('b');
                      oneByOne.nextNameEqualsTo('c');
                      oneByOne.nextNameEqualsTo('');
                  })
      // ── END TARGET TEST ─────────────────────────────
    });
  });
});