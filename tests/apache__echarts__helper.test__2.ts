it('findLinkedNodes_emptySourceModel', function () {
            chart.setOption({
                xAxis: [{}, {}, {}, {}, {}, {}, {}, {}, {}],
                yAxis: [{}, {}, {}, {}, {}, {}, {}, {}, {}],
                dataZoom: [
                    { id: 'dz0', xAxisIndex: [1, 2], yAxisIndex: [0] },
                    { id: 'dz1', xAxisIndex: [3], yAxisIndex: [3, 0] },
                    { id: 'dz2', xAxisIndex: [6, 3], yAxisIndex: [9] },
                    { id: 'dz3', xAxisIndex: [5, 3], yAxisIndex: [] },
                    { id: 'dz4', xAxisIndex: [8], yAxisIndex: [4] }
                ]
            });

            const payload = { type: 'other' };
            const dzModels = findEffectedDataZooms(getECModel(chart), payload);

            expect(dzModels.length === 0);
        })