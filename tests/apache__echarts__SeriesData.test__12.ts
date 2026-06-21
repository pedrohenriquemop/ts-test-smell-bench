it('dataProvider', function () {
            const data = new SeriesData(['x', 'y'], new Model());
            const typedArray = new Float32Array([10, 10, 20, 20]);
            const source = createSourceFromSeriesDataOption(typedArray);
            data.initData({
                count: function (): number {
                    return typedArray.length / 2;
                },
                getItem: function (idx: number): number[] {
                    return [typedArray[idx * 2], typedArray[idx * 2 + 1]];
                },
                getSource: function (): Source {
                    return source;
                }
            });
            expect(data.mapArray(['x', 'y'], function (x, y) {
                return [x, y];
            })).toEqual([[10, 10], [20, 20]]);
            expect(data.getRawDataItem(0)).toEqual([10, 10]);
            expect(data.getItemModel(0).option).toEqual([10, 10]);
        })