it('Should report funnel series missing error', function () {
        const chart = createChart();
        console.error = jest.fn();
        chart.setOption<EChartsOption>({
            series: [{
                type: 'funnel'
            }]
        });
        expect(console.error).toHaveBeenCalledWith(
            makeSerieError('funnel', 'FunnelChart')
        );

        console.error = oldConsoleErr;
    })