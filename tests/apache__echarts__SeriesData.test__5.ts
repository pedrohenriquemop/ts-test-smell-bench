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