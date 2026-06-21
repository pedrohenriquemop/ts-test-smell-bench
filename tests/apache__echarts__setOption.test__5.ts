it('setOpacityWhenUseColor', function (done) {
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

        const visualMapOptionGotten = chart.getOption().visualMap as (
            ContinousVisualMapOption | PiecewiseVisualMapOption
        )[];
        expect(!!visualMapOptionGotten[0].target.outOfRange.opacity).toEqual(true);
        done();
    })