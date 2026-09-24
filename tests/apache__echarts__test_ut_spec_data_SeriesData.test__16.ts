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
    function createStore() {
                const provider = new DefaultDataProvider([['A', 15], ['B', 25], ['C', 35]]);
                const store = new DataStore();
                store.initData(provider, [{type: 'ordinal'}, {type: 'float'}]);
                return store;
            }

    // ── TARGET TEST ─────────────────────────────────
    it('SeriesData#cloneShallow should share store', function () {
                const store = createStore();
                const dims = [{ type: 'float', name: 'dim2' }];
                const data = new SeriesData(dims, null);
                data.initData(store);
                const data2 = data.cloneShallow();
                expect(data2.getStore()).toBe(data.getStore());
            })
    // ── END TARGET TEST ─────────────────────────────
  });
});