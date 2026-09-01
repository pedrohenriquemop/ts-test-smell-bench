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
    it('indexOfRawIndex', function () {
                const data = new SeriesData(['x'], new Model());
                data.initData([]);
                expect(data.indexOfRawIndex(1)).toEqual(-1);

                const data1 = new SeriesData(['x'], new Model());
                data1.initData([0]);
                expect(data1.indexOfRawIndex(0)).toEqual(0);
                expect(data1.indexOfRawIndex(1)).toEqual(-1);

                const data2 = new SeriesData(['x'], new Model());
                data2.initData([0, 1, 2, 3]);
                expect(data2.indexOfRawIndex(1)).toEqual(1);
                expect(data2.indexOfRawIndex(2)).toEqual(2);
                expect(data2.indexOfRawIndex(5)).toEqual(-1);

                const data3 = new SeriesData(['x'], new Model());
                data3.initData([0, 1, 2, 3, 4]);
                expect(data3.indexOfRawIndex(2)).toEqual(2);
                expect(data3.indexOfRawIndex(3)).toEqual(3);
                expect(data3.indexOfRawIndex(5)).toEqual(-1);

                data3.filterSelf(function (idx) {
                    return idx >= 2;
                });
                expect(data3.indexOfRawIndex(2)).toEqual(0);
            })
    // ── END TARGET TEST ─────────────────────────────
  });
});