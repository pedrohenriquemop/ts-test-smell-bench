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
    it('SeriesData can still get other dims value from store when only part of dims are given.', function () {
                const source = createSource(
                    [['A', 15, 20, 'cat'], ['B', 25, 30, 'mouse'], ['C', 35, 40, 'dog']],
                    {
                        dimensions: null,
                        seriesLayoutBy: null,
                        sourceHeader: false
                    },
                    SOURCE_FORMAT_ARRAY_ROWS
                );
                const store = new DataStore();
                store.initData(new DefaultDataProvider(source), [
                    {type: 'ordinal'}, {type: 'float'}, {type: 'float'}, {type: 'ordinal'}
                ]);
                const schema = new SeriesDataSchema({
                    source: source,
                    dimensions: [
                        { type: 'float', name: 'dim1', storeDimIndex: 1 },
                        { type: 'ordinal', name: 'dim3', storeDimIndex: 3 }
                    ],
                    fullDimensionCount: 2,
                    dimensionOmitted: true
                });
                const data = new SeriesData(schema, null);
                data.initData(store);
                // Store should be the same.
                expect(data.getStore()).toBe(store);
                // Get self dim
                expect(data.get('dim1', 0)).toEqual(15);
                expect(data.get('dim1', 1)).toEqual(25);
                // Get other dim
                expect(data.getStore().get(0, 0)).toEqual('A');
                expect(data.getStore().get(0, 1)).toEqual('B');
                expect(data.getStore().get(2, 0)).toEqual(20);
                expect(data.getStore().get(2, 1)).toEqual(30);
                // Get all
                expect(data.getValues(['dim3', 'dim1'], 0)).toEqual(['cat', 15]);
                expect(data.getValues(1)).toEqual(['B', 25, 30, 'mouse']);
            })
    // ── END TARGET TEST ─────────────────────────────
  });
});