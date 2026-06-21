it('Should not report visualMap component missing error when using theme', function () {
        const chart = createChart({
            visualMap: {
                borderColor: '#71708A'
            }
        });

        console.error = jest.fn();
        chart.setOption<EChartsOption>({});
        expect(console.error).not.toBeCalled();

        console.error = oldConsoleErr;
    })