it(`seriesLayoutBy_changed_transform_detection_${itIdx}`, function () {
            const option: EChartsOption = {
                dataset: [{
                    source: makeDatasetSourceDetection()
                }, dataset1],
                xAxis: { type: 'category' },
                yAxis: {},
                series: { type: 'bar', datasetIndex: 1, seriesLayoutBy: 'row' }
            };

            chart.setOption(option);
            const listData = getECModel(chart).getSeries()[0].getData();
            expect(listData.getDimension(1)).toEqual('AAA');
            expect(listData.getDimension(2)).toEqual('BBB');
            expect(listData.getDimension(3)).toEqual('CCC');
            expect(listData.get('product', 0)).toEqual(0);
            expect(retrieveRawValue(listData, 0, 'product')).toEqual('2012');
            expect(listData.get('product', 1)).toEqual(1);
            expect(retrieveRawValue(listData, 1, 'product')).toEqual('2013');
        })