it('cartesian', function () {
        registerMap('test1', testGeoJson1);

        chart.setOption({
            geo: [ // Should not affect grid converter.
                {
                    map: 'test1'
                }
            ],
            grid: [
                {
                    id: 'g0',
                    left: 10,
                    right: '50%',
                    top: 30,
                    bottom: 40,
                    containLabel: false,
                    outerBoundsMode: 'none',
                },
                {
                    id: 'g1',
                    left: '50%',
                    right: 20,
                    top: 30,
                    bottom: 40,
                    containLabel: false,
                    outerBoundsMode: 'none',
                }
            ],
            xAxis: [
                {
                    id: 'x0',
                    type: 'value',
                    min: -500,
                    max: 3000,
                    gridId: 'g0'
                },
                {
                    id: 'x1',
                    type: 'value',
                    min: -50,
                    max: 300,
                    gridId: 'g0'
                },
                {
                    id: 'x2',
                    type: 'value',
                    min: -50,
                    max: 300,
                    gridId: 'g1'
                }
            ],
            yAxis: [
                {
                    id: 'y0',
                    type: 'value',
                    min: 6000,
                    max: 9000,
                    gridId: 'g0'
                },
                {
                    id: 'y1',
                    type: 'value',
                    inverse: true, // test inverse
                    min: 600,
                    max: 900,
                    gridId: 'g1'
                }
            ],
            series: [
                {
                    id: 'k1',
                    type: 'scatter',
                    // left: 0,
                    // right: 0,
                    // top: 0,
                    // bottom: 0,
                    data: [[1000, 700]]
                },
                {
                    id: 'k2',
                    type: 'scatter',
                    // left: 0,
                    // right: 0,
                    // top: 0,
                    // bottom: 0,
                    data: [[100, 800]]
                },
                {
                    id: 'j1',
                    type: 'scatter',
                    // left: 0,
                    // right: 0,
                    // top: 0,
                    // bottom: 0,
                    data: [[100, 800]],
                    xAxisIndex: 1
                },
                {
                    id: 'i1',
                    type: 'scatter',
                    // left: 0,
                    // right: 0,
                    // top: 0,
                    // bottom: 0,
                    data: [],
                    xAxisId: 'x2',
                    yAxisId: 'y1'
                }
            ]
        });

        const width = chart.getWidth();

        expect(chart.containPixel('grid', [15, 30])).toEqual(true);
        expect(chart.containPixel('grid', [9.5, 30])).toEqual(false);
        expect(chart.containPixel({gridIndex: 1}, [width / 2, 50])).toEqual(true);
        expect(chart.containPixel({gridIndex: 1}, [10, 20])).toEqual(false);
    })