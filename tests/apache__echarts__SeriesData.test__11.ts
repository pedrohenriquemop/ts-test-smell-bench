it('filterSelf', function () {
            const data = new SeriesData(['x', 'y'], new Model());
            data.initData([[10, 15], [20, 25], [30, 35]]);
            expect(data.filterSelf(['x', 'y'], function (x, y) {
                return x < 30 && x > 10;
            }).mapArray('x', function (x) {
                return x;
            })).toEqual([20]);
        })