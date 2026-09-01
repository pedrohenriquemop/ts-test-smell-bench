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
    it('dataProvider', function () {
                const data = new SeriesData(['x', 'y'], new Model());
                const typedArray = new Float32Array([10, 10, 20, 20]);
                const source = createSourceFromSeriesDataOption(typedArray);
                data.initData({
                    count: function (): number {
                        return typedArray.length / 2;
                    },
                    getItem: function (idx: number): number[] {
                        return [typedArray[idx * 2], typedArray[idx * 2 + 1]];
                    },
                    getSource: function (): Source {
                        return source;
                    }
                });
                expect(data.mapArray(['x', 'y'], function (x, y) {
                    return [x, y];
                })).toEqual([[10, 10], [20, 20]]);
                expect(data.getRawDataItem(0)).toEqual([10, 10]);
                expect(data.getItemModel(0).option).toEqual([10, 10]);
            })
    // ── END TARGET TEST ─────────────────────────────
  });
});