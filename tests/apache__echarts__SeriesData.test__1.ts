it('initData 2d', function () {
            const data = new SeriesData(['x', 'y'], new Model());
            data.initData([[10, 15], [20, 25], [30, 35]]);
            expect(data.get('x', 1)).toEqual(20);
            expect(data.get('y', 1)).toEqual(25);
        })