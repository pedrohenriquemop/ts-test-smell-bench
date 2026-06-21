it('remainVisualProp', function (done) {
        chart.setOption({
            xAxis: {},
            yAxis: {},
            series: [{type: 'scatter', data: [[12, 223]]}],
            visualMap: {
                inRange: {
                    color: ['red', 'blue', 'yellow']
                }
            }
        });

        chart.setOption({
            visualMap: {}
        });

        expectTheSame(chart.getOption() as EChartsOption);

        chart.setOption({
            series: [{data: [[44, 55]]}] // visualMap depends series
        });

        expectTheSame(chart.getOption() as EChartsOption);

        function expectTheSame(option: EChartsOption) {
            const visualMapOptionGotten = option.visualMap as (ContinousVisualMapOption | PiecewiseVisualMapOption)[];
            expect(visualMapOptionGotten.length).toEqual(1);
            expect(visualMapOptionGotten[0].inRange.color).toEqual(['red', 'blue', 'yellow']);
            expect(visualMapOptionGotten[0].target.inRange.color).toEqual(['red', 'blue', 'yellow']);
            expect(visualMapOptionGotten[0].controller.inRange.color).toEqual(['red', 'blue', 'yellow']);
            done();
        }
    })