it('findLinkedNodes_crossXY', function () {
            chart.setOption({
                xAxis: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
                yAxis: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
                dataZoom: [
                    { id: 'dz0', xAxisIndex: [1, 2], yAxisIndex: [0] },
                    { id: 'dz1', xAxisIndex: [3], yAxisIndex: [3, 0] },
                    { id: 'dz2', xAxisIndex: [6, 3], yAxisIndex: [9] },
                    { id: 'dz3', xAxisIndex: [5, 3], yAxisIndex: [] },
                    { id: 'dz4', xAxisIndex: [8], yAxisIndex: [4] }
                ]
            });

            const payload = { type: 'dataZoom', dataZoomIndex: 0 };
            const dzModels = findEffectedDataZooms(getECModel(chart), payload);

            expect(dzModels.length === 4);
            expect(dzModels[0] === getECModel(chart).getComponent('dataZoom', 0)).toEqual(true);
            expect(dzModels[1] === getECModel(chart).getComponent('dataZoom', 1)).toEqual(true);
            expect(dzModels[2] === getECModel(chart).getComponent('dataZoom', 2)).toEqual(true);
            expect(dzModels[3] === getECModel(chart).getComponent('dataZoom', 3)).toEqual(true);
        })