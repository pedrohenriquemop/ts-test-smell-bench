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

    describe('only_name_declared', () => {
      function doChecks(list: SeriesData) {
                      const oneByOne = makeOneByOneChecker(list);

                      oneByOne.nextIdEqualsTo('a');
                      oneByOne.nextIdEqualsTo('b');
                      oneByOne.nextIdEqualsTo(`b${NAME_REPEAT_PREFIX}2`);
                      oneByOne.nextIdEqualsTo('c');
                      oneByOne.nextIdEqualsTo(`${ID_PREFIX}4`);
                      oneByOne.nextIdEqualsTo(`c${NAME_REPEAT_PREFIX}2`);
                      oneByOne.nextIdEqualsTo('d');
                      oneByOne.nextIdEqualsTo(`c${NAME_REPEAT_PREFIX}3`);

                      oneByOne.nextNameEqualsTo('a');
                      oneByOne.nextNameEqualsTo('b');
                      oneByOne.nextNameEqualsTo('b');
                      oneByOne.nextNameEqualsTo('c');
                      oneByOne.nextNameEqualsTo('');
                      oneByOne.nextNameEqualsTo('c');
                      oneByOne.nextNameEqualsTo('d');
                      oneByOne.nextNameEqualsTo('c');
                  }

      // ── TARGET TEST ─────────────────────────────────
      it('sourceFormatArrayRows', function () {
                      const list = new SeriesData(
                          [
                              'x',
                              { name: 'q', type: 'ordinal', otherDims: { itemName: 0 } }
                          ],
                          new Model()
                      );
                      const source = createSource(
                          [
                              [ 10, 'a' ],
                              [ 20, 'b' ],
                              [ 30, 'b' ],
                              [ 40, 'c' ],
                              [ 50, null ],
                              [ 60, 'c' ],
                              [ 70, 'd' ],
                              [ 80, 'c' ]
                          ],
                          {
                              seriesLayoutBy: 'column',
                              sourceHeader: 0,
                              dimensions: null
                          },
                          SOURCE_FORMAT_ARRAY_ROWS
                      );
                      list.initData(source);

                      doChecks(list);
                  })
      // ── END TARGET TEST ─────────────────────────────
    });
  });
});