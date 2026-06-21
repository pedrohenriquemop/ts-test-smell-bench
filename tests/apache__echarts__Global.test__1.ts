it('sameTypeMergeFull', function () {
            chart.setOption({
                xAxis: {data: ['a']},
                yAxis: {},
                series: [
                    {type: 'line', data: [11]},
                    {type: 'line', data: [22]},
                    {type: 'line', data: [33]}
                ]
            });

            // Merge
            const origins = saveOrigins(chart);
            chart.setOption({
                series: [
                    {type: 'line', data: [111]},
                    {type: 'line', data: [222]},
                    {type: 'line', data: [333]}
                ]
            });

            expect(countSeries(chart)).toEqual(3);
            expect(countChartViews(chart)).toEqual(3);
            expect(getData0(chart, 0)).toEqual(111);
            expect(getData0(chart, 1)).toEqual(222);
            expect(getData0(chart, 2)).toEqual(333);
            viewEqualsToOrigin(chart, [0, 1, 2], origins, true);
            modelEqualsToOrigin(chart, [0, 1, 2], origins, true);
        })