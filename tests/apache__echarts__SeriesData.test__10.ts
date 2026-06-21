it('mapArray', function () {
            const data = new SeriesData(['x', 'y'], new Model());
            data.initData([[10, 15], [20, 25], [30, 35]]);
            expect(data.mapArray(['x', 'y'], function (x, y) {
                return [x, y];
            })).toEqual([[10, 15], [20, 25], [30, 35]]);
        })