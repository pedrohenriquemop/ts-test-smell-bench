it('initData 2d yx', function () {
            const data = new SeriesData(['y', 'x'], new Model());
            data.initData([[10, 15], [20, 25], [30, 35]]);
            expect(data.get('x', 1)).toEqual(25);
            expect(data.get('y', 1)).toEqual(20);
        })