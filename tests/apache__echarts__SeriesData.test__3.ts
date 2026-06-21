it('Data with option 1d', function () {
            const data = new SeriesData(['x', 'y'], new Model());
            data.initData([
                1,
                {
                    value: 2,
                    somProp: 'foo'
                } as OptionDataItemObject<OptionDataValue>
            ]);
            expect(data.getItemModel(1).get('somProp' as any)).toEqual('foo');
            expect(data.getItemModel(0).get('somProp' as any)).toBeNull();
        })