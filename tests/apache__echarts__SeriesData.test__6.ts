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