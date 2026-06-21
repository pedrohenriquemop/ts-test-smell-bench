it('Should report dataZoom component missing error', function () {
        const chart = createChart();
        console.error = jest.fn();
        chart.setOption<EChartsOption>({
            dataZoom: {}
        });
        expect(console.error).toHaveBeenCalledWith(
            makeComponentError('dataZoom', 'DataZoomComponent')
        );

        console.error = oldConsoleErr;
    })