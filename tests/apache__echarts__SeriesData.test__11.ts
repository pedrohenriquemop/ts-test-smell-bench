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

  describe('Data Manipulation', () => {

    // ── TARGET TEST ─────────────────────────────────
    it('filterSelf', function () {
                const data = new SeriesData(['x', 'y'], new Model());
                data.initData([[10, 15], [20, 25], [30, 35]]);
                expect(data.filterSelf(['x', 'y'], function (x, y) {
                    return x < 30 && x > 10;
                }).mapArray('x', function (x) {
                    return x;
                })).toEqual([20]);
            })
    // ── END TARGET TEST ─────────────────────────────
  });
});