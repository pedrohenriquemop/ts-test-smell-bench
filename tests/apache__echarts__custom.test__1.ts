it('should pass user defined data to event handlers', async () => {
        const data = [
            [10, 16],
            [20, 18],
            [30, 26],
            [40, 32],
            [50, 56],
          ];
        const option = {
            xAxis: { scale: true },
            yAxis: {},
            grid: {
                containLabel: false,
                left: '10%',
                right: '10%',
                top: 60,
                bottom: 70
            },
            series: [
                {
                    type: 'custom',
                    renderItem: function (params: any, api:any) {
                        const yValue = api.value(1);
                        const start = api.coord([api.value(0), yValue]);
                        const size = api.size([0, yValue]);
                        return {
                            type: 'rect',
                            info: { foo: 'bar' },
                            shape: {
                                x: start[0],
                                y: start[1],
                                width: 50,
                                height: size[1]
                            }
                        };
                    },
                    data: data
                }
            ]
        };
        chart.setOption(option);
        let customInfo: any;
        chart.on('mousemove', param => customInfo = param.info);
        const el = chart.getDom().children.item(0);
        const e = new MouseEvent('mousemove');
        Object.assign(e, { zrX: 100, zrY: 270 });
        el.dispatchEvent(e)
        expect(customInfo).toEqual({ foo: 'bar' });
    })