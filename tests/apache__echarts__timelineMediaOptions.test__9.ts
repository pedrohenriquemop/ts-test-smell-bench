it('timeline_setOptionOnceMore_baseOption', function () {
            const option: EChartsOption = {
                baseOption: {
                    timeline: {
                        axisType: 'category',
                        autoPlay: false,
                        playInterval: 1000
                    },
                    xAxis: {data: ['a']},
                    yAxis: {}
                },
                options: [{
                    series: [
                        { type: 'line', data: [11] },
                        { type: 'line', data: [22] }
                    ]
                }, {
                    series: [
                        { type: 'line', data: [111] },
                        { type: 'line', data: [222] }
                    ]
                }]
            };
            chart.setOption(option);

            expect(getData0(chart, 0)).toEqual(11);
            expect(getData0(chart, 1)).toEqual(22);

            chart.setOption({
                xAxis: {data: ['b']}
            });

            expect(getData0(chart, 0)).toEqual(11);
            expect(getData0(chart, 1)).toEqual(22);

            chart.setOption<EChartsOption>({
                xAxis: {data: ['c']},
                timeline: {
                    currentIndex: 1
                }
            });

            expect(getData0(chart, 0)).toEqual(111);
            expect(getData0(chart, 1)).toEqual(222);
        })