it('dataZoom', function () {

        chart.setOption({
            xAxis: {},
            yAxis: {},
            color: ['#000', '#111', '#222'],
            dataZoom: {
                xAxisIndex: 0,
                startValue: 45
            },
            series: [
                {
                    id: 'k2',
                    type: 'scatter',
                    data: [
                        [10, 7],
                        [20, 7],
                        [30, 7],
                        [40, 7],
                        {
                            value: [50, 222],
                            itemStyle: {
                                color: '#ff0'
                            }
                        }
                    ],
                    itemStyle: {
                        color: '#eee'
                    }
                }
            ]
        });

        expect(chart.getVisual({dataIndex: 4, seriesId: 'k2'}, 'color')).toEqual('#ff0');
        expect(chart.getVisual({dataIndexInside: 0, seriesId: 'k2'}, 'color')).toEqual('#ff0');
        expect(chart.getVisual({dataIndex: 1, seriesId: 'k2'}, 'color')).toEqual('#eee');
    })