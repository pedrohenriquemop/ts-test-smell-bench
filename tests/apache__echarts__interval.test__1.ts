it('ticks_small_value', function () {
            chart.setOption({
                tooltip: {},
                xAxis: [
                    {
                        type: 'category',
                        data: ['Mon'],
                        axisTick: {
                            alignWithLabel: true
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                series: [
                    {
                        name: '',
                        type: 'bar',
                        data: [0.0000034]
                    }
                ]
            });

            const yAxis = getECModel(chart).getComponent('yAxis', 0) as CartesianAxisModel;
            const scale = yAxis.axis.scale as IntervalScale;
            const ticks = scale.getTicks();
            const labels = yAxis.axis.getViewLabels().map(function (item) {
                return item.formattedLabel;
            });

            const labelPrecisioned = scale.getLabel({ value: 0.0000005 }, { precision: 10 });

            expect(ticks.map(tick => tick.value)).toEqual(
                [0, 0.0000005, 0.000001, 0.0000015, 0.000002, 0.0000025, 0.000003, 0.0000035]
            );
            expect(labels).toEqual(
                // Should not be '5e-7'
                ['0', '0.0000005', '0.000001', '0.0000015', '0.000002', '0.0000025', '0.000003', '0.0000035']
            );
            expect(labelPrecisioned).toEqual('0.0000005000');
        })