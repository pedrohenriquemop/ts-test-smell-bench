it('parse_media_no_baseOption_has_default', function () {
            const option: EChartsOption = {
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
                }]
            };
            chart.setOption(option);
            expect(getLegendOption(chart).left).toEqual(100);

            chart.resize({ width: 600 });
            expect(getLegendOption(chart).left).toEqual(50);
        })