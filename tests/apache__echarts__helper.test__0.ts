it('findLinkedNodes_base', function () {
            chart.setOption({
                xAxis: [{}, {}, {}, {}, {}, {}],
                yAxis: [{}, {}, {}, {}, {}, {}],
                dataZoom: [
                    { id: 'dz0', xAxisIndex: [1, 2], yAxisIndex: [0] },
                    { id: 'dz1', xAxisIndex: [3], yAxisIndex: [1] },
                    { id: 'dz2', xAxisIndex: [5], yAxisIndex: [] },
                    { id: 'dz3', xAxisIndex: [2, 5], yAxisIndex: [] }
                ]
            });

            const payload = { type: 'dataZoom', dataZoomIndex: 0 };
            const dzModels = findEffectedDataZooms(getECModel(chart), payload);

            expect(dzModels.length === 3);
            expect(dzModels[0] === getECModel(chart).getComponent('dataZoom', 0)).toEqual(true);
            expect(dzModels[1] === getECModel(chart).getComponent('dataZoom', 3)).toEqual(true);
            expect(dzModels[2] === getECModel(chart).getComponent('dataZoom', 2)).toEqual(true);
        })