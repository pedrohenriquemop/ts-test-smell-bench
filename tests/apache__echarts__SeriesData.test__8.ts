it('Data types', function () {
            const data = new SeriesData([{
                name: 'x',
                type: 'int'
            }, {
                name: 'y',
                type: 'float'
            }], new Model());
            data.initData([[1.1, 1.1]]);
            expect(data.get('x', 0)).toEqual(1);
            expect(data.get('y', 0)).toBeCloseTo(1.1, 5);
        })