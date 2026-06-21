it('parse_timeline_has_baseOption_compat', function () {
            const option: EChartsOption = {
                timeline: { axisType: 'category' },
                baseOption: {
                    xAxis: { data: ['a'] },
                    yAxis: {},
                    legend: { },
                    series: { name: 'a', type: 'line', data: [11] }
                },
                legend: { right: 123 }, // Illegal, should be ignored
                options: [
                    { series: { type: 'line', data: [88] } },
                    { series: { type: 'line', data: [99] } }
                ]
            };
            chart.setOption(option);
            expect(getData0(chart, 0)).toEqual(88);
            expect(getLegendOption(chart).right).not.toEqual(123);
            expect(getTimelineComponent(chart) != null).toEqual(true);

            chart.setOption<EChartsOption>({ timeline: { currentIndex: 1 } });
            expect(getData0(chart, 0)).toEqual(99);
        })