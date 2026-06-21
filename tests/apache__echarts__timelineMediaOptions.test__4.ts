it('parse_timeline_media_no_baseOption', function () {
            const option: EChartsOption = {
                timeline: { axisType: 'category' },
                xAxis: { data: ['a'] },
                yAxis: {},
                legend: { left: 10 },
                series: { name: 'a', type: 'line', data: [11] },
                media: [{
                    query: { maxWidth: 670, minWidth: 550 },
                    option: {
                        legend: { left: 50 }
                    }
                }, {
                    option: {
                        legend: { left: 100 }
                    }
                }],
                options: [
                    { series: { type: 'line', data: [88] } },
                    { series: { type: 'line', data: [99] } }
                ]
            };
            chart.setOption(option);
            expect(getLegendOption(chart).left).toEqual(100);
            expect(getData0(chart, 0)).toEqual(88);
            expect(getTimelineComponent(chart) != null).toEqual(true);

            chart.resize({ width: 600 });
            expect(getData0(chart, 0)).toEqual(88);
            expect(getLegendOption(chart).left).toEqual(50);

            chart.setOption<EChartsOption>({ timeline: { currentIndex: 1 } });
            expect(getData0(chart, 0)).toEqual(99);
            expect(getLegendOption(chart).left).toEqual(50);
        })