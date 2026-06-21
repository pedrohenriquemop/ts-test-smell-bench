it('map', function () {
            const data = new SeriesData(['x', 'y'], new Model());
            data.initData([[10, 15], [20, 25], [30, 35]]);
            expect(data.map(['x', 'y'], function (x: number, y: number) {
                return [x + 2, y + 2];
            }).mapArray('x', function (x) {
                return x;
            })).toEqual([12, 22, 32]);
        })