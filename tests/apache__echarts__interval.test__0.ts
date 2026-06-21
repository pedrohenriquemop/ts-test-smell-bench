it('ticks_min_max', function () {

            const min = 0;
            const max = 54.090909;
            const splitNumber = 5;

            chart.setOption({
                xAxis: {},
                yAxis: {
                    type: 'value',
                    min: min,
                    max: max,
                    interval: max / splitNumber,
                    splitNumber: splitNumber
                },
                series: [{type: 'line', data: []}]
            });

            const yAxis = getECModel(chart).getComponent('yAxis', 0) as CartesianAxisModel;
            const scale = yAxis.axis.scale;
            const ticks = scale.getTicks();

            expect(ticks[0].value).toEqual(min);
            expect(ticks[ticks.length - 1].value).toEqual(max);
        })