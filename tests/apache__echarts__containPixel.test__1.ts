it('map', function () {
        registerMap('test1', testGeoJson1);
        registerMap('test2', testGeoJson2);

        chart.setOption({
            series: [
                {
                    id: 'k1',
                    type: 'map',
                    map: 'test1',
                    left: 10,
                    right: '50%',
                    top: 30,
                    bottom: 40
                },
                {
                    id: 'k2',
                    type: 'map',
                    map: 'test2',
                    layoutCenter: ['50%', 50],
                    layoutSize: 20,
                    aspectScale: 1
                }
            ]
        });

        const width = chart.getWidth();

        expect(chart.containPixel('series', [15, 30])).toEqual(true);
        expect(chart.containPixel('series', [9.5, 30])).toEqual(false);
        expect(chart.containPixel({seriesId: 'k2'}, [width / 2, 50])).toEqual(true);
        expect(chart.containPixel({seriesId: 1}, [10, 20])).toEqual(false);
    })