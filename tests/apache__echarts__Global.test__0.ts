it('sameTypeNotMerge', function () {
            const option: EChartsOption = {
                xAxis: {data: ['a']},
                yAxis: {},
                series: [
                    {type: 'line', data: [11]},
                    {type: 'line', data: [22]},
                    {type: 'line', data: [33]}
                ]
            };
            chart.setOption(option);

            // Not merge
            const origins = saveOrigins(chart);
            chart.setOption(option, true);
            expect(countChartViews(chart)).toEqual(3);
            expect(countSeries(chart)).toEqual(3);
            modelEqualsToOrigin(chart, [0, 1, 2], origins, false);
            viewEqualsToOrigin(chart, [0, 1, 2], origins, true);
        })