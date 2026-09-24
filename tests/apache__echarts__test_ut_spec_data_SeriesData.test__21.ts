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

    describe('id_name_declared_sourceFormat_arrayRows', () => {

      // ── TARGET TEST ─────────────────────────────────
      it('has_ordinalMeta', function () {
                      const ordinalMetaP = new OrdinalMeta({
                          categories: [],
                          needCollect: true,
                          deduplication: true
                      });
                      const ordinalMetaQ = new OrdinalMeta({
                          categories: [],
                          needCollect: true,
                          deduplication: true
                      });
                      testArrayRowsInSource([
                          { name: 'x', type: 'number' },
                          { name: 'p', type: 'ordinal', otherDims: { itemId: 0 }, ordinalMeta: ordinalMetaP },
                          { name: 'q', type: 'ordinal', otherDims: { itemName: 0 }, ordinalMeta: ordinalMetaQ }
                      ]);
                  })
      // ── END TARGET TEST ─────────────────────────────
      function testArrayRowsInSource(dimensionsInfo: SeriesDimensionDefine[]): void {
                      const list = new SeriesData(dimensionsInfo, new Model());
                      const oneByOne = makeOneByOneChecker(list);

                      const source = createSource(
                          [
                              [0, 'myId_10', null],
                              [10, 555, null], // numeric id.
                              [20, '666%', null],
                              [30, 'myId_good', 'b'],
                              [40, null, 'b'],
                              [50, null, null],
                              [60, undefined, null],
                              [70, NaN, null],
                              [80, '', null],
                              [90, null, 'b'],
                              [100, null, null],
                              [110, 'myId_better', null],
                              [120, 'myId_better', null] // duplicated id.
                          ],
                          {
                              seriesLayoutBy: 'column',
                              sourceHeader: 0,
                              dimensions: null
                          },
                          SOURCE_FORMAT_ARRAY_ROWS
                      );
                      list.initData(source);
                      oneByOne.nextIdEqualsTo('myId_10');
                      oneByOne.nextIdEqualsTo('555');
                      oneByOne.nextIdEqualsTo('666%');
                      oneByOne.nextIdEqualsTo('myId_good');
                      oneByOne.nextIdEqualsTo(`${ID_PREFIX}${oneByOne.currGetIdDataIndex()}`);
                      oneByOne.nextIdEqualsTo(`${ID_PREFIX}${oneByOne.currGetIdDataIndex()}`);
                      oneByOne.nextIdEqualsTo(`${ID_PREFIX}${oneByOne.currGetIdDataIndex()}`);
                      oneByOne.nextIdEqualsTo('NaN');
                      oneByOne.nextIdEqualsTo('');
                      oneByOne.nextIdEqualsTo(`${ID_PREFIX}${oneByOne.currGetIdDataIndex()}`);
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
                          [ 200, 'myId_best', null ],
                          [ 210, 999, null ], // numeric id.
                          [ 220, '777px', null],
                          [ 230, null, 'b' ],
                          [ 240, null, null ]
                      ]);

                      oneByOne.nextIdEqualsTo('myId_best');
                      oneByOne.nextIdEqualsTo('999');
                      oneByOne.nextIdEqualsTo('777px');
                      oneByOne.nextIdEqualsTo(`${ID_PREFIX}${oneByOne.currGetIdDataIndex()}`);
                      oneByOne.nextIdEqualsTo(`${ID_PREFIX}${oneByOne.currGetIdDataIndex()}`);

                      oneByOne.nextNameEqualsTo('');
                      oneByOne.nextNameEqualsTo('');
                      oneByOne.nextNameEqualsTo('');
                      oneByOne.nextNameEqualsTo('b');
                      oneByOne.nextNameEqualsTo('');

                      list.appendValues([], ['b', 'c', null]);

                      oneByOne.nextIdEqualsTo(`${ID_PREFIX}${oneByOne.currGetIdDataIndex()}`);
                      oneByOne.nextIdEqualsTo(`${ID_PREFIX}${oneByOne.currGetIdDataIndex()}`);
                      oneByOne.nextIdEqualsTo(`${ID_PREFIX}${oneByOne.currGetIdDataIndex()}`);

                      oneByOne.nextNameEqualsTo('b');
                      oneByOne.nextNameEqualsTo('c');
                      oneByOne.nextNameEqualsTo('');
                  }
    });
  });
});