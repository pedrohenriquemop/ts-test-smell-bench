it('forbid_seriesLayoutBy_row', function () {
        const option: EChartsOption = {
            dataset: [{
                source: makeDatasetSourceDetection(),
                // This config should cause error thrown.
                seriesLayoutBy: 'row'
            }, {
                transform: { type: 'filter', config: { dimension: 0, ne: '' } }
            }],
            xAxis: { type: 'category' },
            yAxis: {},
            series: { type: 'bar', datasetIndex: 1 }
        };

        expect(() => {
            chart.setOption(option);
        }).toThrowError(/column/);
    })