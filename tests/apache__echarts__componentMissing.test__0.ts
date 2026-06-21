it('Should report grid component missing error', function () {
        const chart = createChart();
        console.error = jest.fn();
        chart.setOption<EChartsOption>({
            xAxis: {},
            yAxis: {},
            series: []
        });
        expect(console.error).toHaveBeenCalledWith(
            makeComponentError('xAxis', 'GridComponent')
        );

        console.error = oldConsoleErr;
    })