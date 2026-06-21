it('initData 1d', function () {
            const data = new SeriesData(['x', 'y'], new Model());
            data.initData([10, 20, 30]);
            expect(data.get('x', 0)).toEqual(10);
            expect(data.get('x', 1)).toEqual(20);
            expect(data.get('x', 2)).toEqual(30);
            expect(data.get('y', 1)).toEqual(20);
        })