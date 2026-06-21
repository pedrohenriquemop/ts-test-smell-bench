it('Should not report pie series missing error', function () {
        const chart = createChart();
        console.error = jest.fn();
        chart.setOption<EChartsOption>({
            series: [{
                type: 'pie'
            }]
        });
        expect(console.error).not.toBeCalled();
        console.error = oldConsoleErr;
    })