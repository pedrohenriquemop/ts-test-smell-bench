it('eraseAllVisualProps_notRelative', function (done) {
        chart.setOption({
            xAxis: {},
            yAxis: {},
            series: [{type: 'scatter', data: [[12, 223]]}],
            visualMap: {
                inRange: {
                    color: ['red', 'blue', 'yellow'],
                    symbolSize: [0.3, 0.5]
                }
            }
        });

        // const option = chart.getOption();

        chart.setOption({
            visualMap: {
                inRange: {
                    symbolSize: [0.4, 0.6]
                }
            }
        });

        const option = chart.getOption();
        const visualMapOptionGotten = option.visualMap as (ContinousVisualMapOption | PiecewiseVisualMapOption)[];

        expect(visualMapOptionGotten.length).toEqual(1);
        expect(visualMapOptionGotten[0].inRange.hasOwnProperty('color')).toEqual(false);
        expect(visualMapOptionGotten[0].target.inRange.hasOwnProperty('color')).toEqual(false);
        expect(visualMapOptionGotten[0].controller.inRange.hasOwnProperty('color')).toEqual(false);
        expect(visualMapOptionGotten[0].inRange.symbolSize).toEqual([0.4, 0.6]);
        expect(visualMapOptionGotten[0].target.inRange.symbolSize).toEqual([0.4, 0.6]);
        done();
        // Do not compare controller.inRange.symbolSize, which will be amplified to controller size.
        // expect(option.visualMap[0].controller.inRange.symbolSize).toEqual([?, ?]);
    })