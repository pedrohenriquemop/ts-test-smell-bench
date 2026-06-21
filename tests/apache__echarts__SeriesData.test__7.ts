it('getDataExtent', function () {
            const data = new SeriesData(['x', 'y'], new Model());
            data.initData([1, 2, 3]);
            expect(data.getDataExtent('x')).toEqual([1, 3]);
            expect(data.getDataExtent('y')).toEqual([1, 3]);
        })