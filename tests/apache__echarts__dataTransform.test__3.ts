it(`seriesLayoutBy_changed_transform_non_detection_${itIdx}`, function () {
            const sourceWrap = makeDatasetSourceNonDetectionByRow();
            const option: EChartsOption = {
                dataset: [{
                    dimensions: sourceWrap.dimensions,
                    source: sourceWrap.source
                }, dataset1],
                xAxis: {},
                yAxis: {},
                series: { type: 'bar', datasetIndex: 1, seriesLayoutBy: 'row' }
            };

            chart.setOption(option);
            const listData = getECModel(chart).getSeries()[0].getData();
            expect(listData.get(listData.getDimension(0), 0)).toEqual(41.1);
            expect(listData.get(listData.getDimension(0), 1)).toEqual(30.4);
        })