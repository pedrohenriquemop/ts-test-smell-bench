it('scatter', function () {
        chart.setOption({
            xAxis: {},
            yAxis: {},
            color: ['#000', '#111', '#222'],
            visualMap: {
                seriesIndex: 3,
                dimension: 1,
                min: 0,
                max: 10000,
                inRange: {
                    color: 'red'
                }
            },
            series: [
                {
                    id: 'k0',
                    type: 'scatter',
                    data: [[1000, 700], [333, 222]]
                },
                {
                    id: 'k1',
                    type: 'scatter',
                    data: [[10, 7]],
                    itemStyle: {
                        color: '#fff'
                    }
                },
                {
                    id: 'k2',
                    type: 'scatter',
                    data: [
                        [10, 7],
                        {
                            value: [333, 222],
                            itemStyle: {
                                color: '#ff0'
                            }
                        }
                    ],
                    itemStyle: {
                        color: '#eee'
                    }
                },
                {
                    id: 'k3',
                    type: 'scatter',
                    data: [
                        [10, 7],
                        {
                            value: [333, 9999],
                            itemStyle: {
                                color: 'red'
                            }
                        }
                    ],
                    itemStyle: {
                        color: '#eee'
                    }
                }
            ]
        });

        expect(chart.getVisual({dataIndex: 1}, 'color')).toEqual('#000');

        expect(chart.getVisual({dataIndex: 0, seriesIndex: 1}, 'color')).toEqual('#fff');
        expect(chart.getVisual({seriesIndex: 1}, 'color')).toEqual('#fff');

        expect(chart.getVisual({dataIndex: 1, seriesId: 'k2'}, 'color')).toEqual('#ff0');
        expect(chart.getVisual({seriesId: 'k2'}, 'color')).toEqual('#eee');

        expect(chart.getVisual({dataIndex: 1, seriesId: 'k3'}, 'color')).toEqual('red');
        expect(chart.getVisual({seriesId: 'k3'}, 'color')).toEqual('#eee');
    })