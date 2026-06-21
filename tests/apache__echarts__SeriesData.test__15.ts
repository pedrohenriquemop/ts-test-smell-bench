it('SeriesData#cloneShallow should share store', function () {
            const store = createStore();
            const dims = [{ type: 'float', name: 'dim2' }];
            const data = new SeriesData(dims, null);
            data.initData(store);
            const data2 = data.cloneShallow();
            expect(data2.getStore()).toBe(data.getStore());
        })