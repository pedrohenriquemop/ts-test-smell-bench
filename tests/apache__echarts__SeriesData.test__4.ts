it('Empty data', function () {
            const data = new SeriesData(['x', 'y'], new Model());
            data.initData([1, '-']);
            expect(data.get('y', 1)).toBeNaN();
        })