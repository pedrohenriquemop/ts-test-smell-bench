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