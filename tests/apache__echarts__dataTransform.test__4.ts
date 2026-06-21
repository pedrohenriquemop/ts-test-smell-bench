it(`inherit_detected_dimensions_${itIdx}`, function () {
            const option: EChartsOption = {
                dataset: [{
                    source: makeDatasetSourceDetection()
                }, dataset1],
                xAxis: { type: 'category' },
                yAxis: {},
                series: { type: 'bar', datasetIndex: 1 }
            };

            chart.setOption(option);
            const listData = getECModel(chart).getSeries()[0].getData();
            expect(listData.getDimension(0)).toEqual('product');
            expect(listData.getDimension(1)).toEqual('2012');
            expect(listData.getDimension(2)).toEqual('2013');
        })