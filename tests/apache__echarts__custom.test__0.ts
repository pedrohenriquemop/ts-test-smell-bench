it('visual_palette', function () {
        const colors = ['#111111', '#222222', '#333333'];
        const resultPaletteColors: ZRColor[] = [];

        function renderItem(params: CustomSeriesRenderItemParams, api: CustomSeriesRenderItemAPI) {
            const color = api.visual('color');
            resultPaletteColors.push(color);
            return {
                type: 'circle'
            };
        }

        chart.setOption({
            color: colors,
            xAxis: { data: ['a'] },
            yAxis: {},
            series: [{
                type: 'custom',
                renderItem: renderItem,
                data: [11]
            }, {
                type: 'custom',
                renderItem: renderItem,
                data: [22]
            }, {
                type: 'custom',
                renderItem: renderItem,
                data: [33]
            }]
        }, true);

        expect(resultPaletteColors).toEqual(colors);
    })