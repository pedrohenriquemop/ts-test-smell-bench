it('ec2ColorCompatiable', function (done) {
        chart.setOption({
            xAxis: {},
            yAxis: {},
            series: [{type: 'scatter', data: [[12, 223]]}],
            visualMap: {
                color: ['yellow', 'blue', 'red']
            }
        });

        const option = chart.getOption();
        const visualMapOptionGotten = option.visualMap as (ContinousVisualMapOption | PiecewiseVisualMapOption)[];

        expect(visualMapOptionGotten.length).toEqual(1);
        expect(visualMapOptionGotten[0].color).toEqual(['yellow', 'blue', 'red']);
        expect(visualMapOptionGotten[0].target.inRange.color).toEqual(['red', 'blue', 'yellow']);
        expect(visualMapOptionGotten[0].controller.inRange.color).toEqual(['red', 'blue', 'yellow']);
        done();
    })