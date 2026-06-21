it('Should not report title component missing error', function () {
        const chart = createChart();
        console.error = jest.fn();
        chart.setOption<EChartsOption>({
            title: {},
            series: []
        });
        expect(console.error).not.toBeCalled();

        console.error = oldConsoleErr;
    })