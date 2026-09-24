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
    it('Data types', function () {
                const data = new SeriesData([{
                    name: 'x',
                    type: 'int'
                }, {
                    name: 'y',
                    type: 'float'
                }], new Model());
                data.initData([[1.1, 1.1]]);
                expect(data.get('x', 0)).toEqual(1);
                expect(data.get('y', 0)).toBeCloseTo(1.1, 5);
            })
    // ── END TARGET TEST ─────────────────────────────
  });
});