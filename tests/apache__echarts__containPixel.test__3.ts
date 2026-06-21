it('graph', function () {
        registerMap('test1', testGeoJson1);

        chart.setOption({
            geo: [ // Should not affect graph converter.
                {
                    map: 'test1'
                }
            ],
            series: [
                {
                    id: 'k1',
                    type: 'graph',
                    left: 10,
                    right: '50%',
                    top: 30,
                    bottom: 40,
                    data: [
                        {x: 1000, y: 2000},
                        {x: 1000, y: 5000},
                        {x: 3000, y: 5000},
                        {x: 3000, y: 2000}
                    ],
                    links: []
                }
            ]
        });

        expect(chart.containPixel('series', [15, 35])).toEqual(true);
        expect(chart.containPixel('series', [3, 4])).toEqual(false);
    })