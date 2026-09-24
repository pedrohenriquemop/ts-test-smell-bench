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

  describe('Data store', () => {

    // ── TARGET TEST ─────────────────────────────────
    it('should collect dimensions across all object rows', function () {
                const source = createSource([
                    { timestamp: 1568191020000, ECM: 26311.466666666667 },
                    { timestamp: 1568191140000, ECM: 1666775.3333333333, GSWY: 1332.5333333333333 }
                ], {
                    dimensions: null,
                    seriesLayoutBy: null,
                    sourceHeader: false
                }, SOURCE_FORMAT_OBJECT_ROWS);

                expect(source.dimensionsDefine.map(dim => dim.name)).toEqual(['timestamp', 'ECM', 'GSWY']);
            })
    // ── END TARGET TEST ─────────────────────────────
    function createStore() {
                const provider = new DefaultDataProvider([['A', 15], ['B', 25], ['C', 35]]);
                const store = new DataStore();
                store.initData(provider, [{type: 'ordinal'}, {type: 'float'}]);
                return store;
            }
  });
});