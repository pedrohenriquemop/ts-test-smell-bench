it('eraseAllVisualProps_reletive', function (done) {
        chart.setOption({
            xAxis: {},
            yAxis: {},
            series: [{type: 'scatter', data: [[12, 223]]}],
            visualMap: {
                inRange: {
                    color: ['red', 'blue', 'yellow'],
                    colorAlpha: [0.3, 0.5]
                }
            }
        });

        chart.setOption({
            visualMap: {
                inRange: {
                    colorAlpha: [0.4, 0.6]
                }
            }
        });

        let visualMapOptionGotten: (ContinousVisualMapOption | PiecewiseVisualMapOption)[];
        visualMapOptionGotten = chart.getOption().visualMap as typeof visualMapOptionGotten;
        expect(visualMapOptionGotten.length).toEqual(1);
        expect(visualMapOptionGotten[0].inRange.hasOwnProperty('color')).toEqual(false);
        expect(visualMapOptionGotten[0].target.inRange.hasOwnProperty('color')).toEqual(false);
        expect(visualMapOptionGotten[0].controller.inRange.hasOwnProperty('color')).toEqual(false);
        expect(visualMapOptionGotten[0].inRange.colorAlpha).toEqual([0.4, 0.6]);
        expect(visualMapOptionGotten[0].target.inRange.colorAlpha).toEqual([0.4, 0.6]);
        expect(visualMapOptionGotten[0].controller.inRange.colorAlpha).toEqual([0.4, 0.6]);

        chart.setOption({
            visualMap: {
                color: ['red', 'blue', 'green']
            }
        });

        visualMapOptionGotten = chart.getOption().visualMap as typeof visualMapOptionGotten;
        expect(visualMapOptionGotten.length).toEqual(1);
        expect(visualMapOptionGotten[0].target.inRange.hasOwnProperty('colorAlpha')).toEqual(false);
        expect(visualMapOptionGotten[0].controller.inRange.hasOwnProperty('colorAlpha')).toEqual(false);
        expect(visualMapOptionGotten[0].target.inRange.color).toEqual(['green', 'blue', 'red']);
        expect(visualMapOptionGotten[0].controller.inRange.color).toEqual(['green', 'blue', 'red']);

        chart.setOption({
            visualMap: {
                controller: {
                    outOfRange: {
                        symbol: ['diamond']
                    }
                }
            }
        });

        visualMapOptionGotten = chart.getOption().visualMap as typeof visualMapOptionGotten;

        expect(visualMapOptionGotten.length).toEqual(1);
        expect(!!visualMapOptionGotten[0].target.inRange).toEqual(true);
        let onlyColor = true;
        for (const i in visualMapOptionGotten[0].target.inRange) {
            if (i !== 'color') {
                onlyColor = false;
            }
        }
        const inRangeColor = visualMapOptionGotten[0].target.inRange.color;
        expect(onlyColor).toEqual(true);
        expect(inRangeColor).toEqual(globalDefault.gradientColor);
        expect(visualMapOptionGotten[0].controller.outOfRange.symbol).toEqual(['diamond']);
        done();
    })