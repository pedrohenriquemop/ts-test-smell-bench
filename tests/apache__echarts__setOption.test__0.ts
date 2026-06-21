it('defaultTargetController', function (done) {
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

        const option = chart.getOption();
        const visualMapOptionGotten = option.visualMap as (ContinousVisualMapOption | PiecewiseVisualMapOption)[];

        expect(visualMapOptionGotten.length).toEqual(1);
        expect(visualMapOptionGotten[0].inRange.color).toEqual(['red', 'blue', 'yellow']);
        expect(visualMapOptionGotten[0].target.inRange.color).toEqual(['red', 'blue', 'yellow']);
        expect(visualMapOptionGotten[0].controller.inRange.color).toEqual(['red', 'blue', 'yellow']);
        done();
    })