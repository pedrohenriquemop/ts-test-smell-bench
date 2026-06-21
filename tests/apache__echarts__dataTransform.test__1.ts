it('seriesLayoutBy_changed_no_transform', function () {
        const option: EChartsOption = {
            dataset: {
                source: makeDatasetSourceDetection()
            },
            xAxis: { type: 'category' },
            yAxis: {},
            series: { type: 'bar', seriesLayoutBy: 'row' }
        };

        chart.setOption(option);
        const listData = getECModel(chart).getSeries()[0].getData();
        expect(listData.getDimension(1)).toEqual('AAA');
        expect(listData.getDimension(2)).toEqual('BBB');
        expect(listData.getDimension(3)).toEqual('CCC');
    })