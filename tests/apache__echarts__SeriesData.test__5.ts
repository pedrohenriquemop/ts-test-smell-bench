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
    it('getRawValue', function () {
                const data1 = new SeriesData(['x', 'y'], new Model());
                // here construct a new data2 because if we only use one data
                // to call initData() twice, data._chunkCount will be accumulated
                // to 1 instead of 0.
                const data2 = new SeriesData(['x', 'y'], new Model());

                data1.initData([1, 2, 3]);
                expect(data1.getItemModel(1).option).toEqual(2);

                data2.initData([[10, 15], [20, 25], [30, 35]]);
                expect(data2.getItemModel(1).option).toEqual([20, 25]);
            })
    // ── END TARGET TEST ─────────────────────────────
  });
});