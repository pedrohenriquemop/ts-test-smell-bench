it('sourceFormatArrayRows', function () {
                const list = new SeriesData(
                    [
                        'x',
                        { name: 'q', type: 'ordinal', otherDims: { itemName: 0 } }
                    ],
                    new Model()
                );
                const source = createSource(
                    [
                        [ 10, 'a' ],
                        [ 20, 'b' ],
                        [ 30, 'b' ],
                        [ 40, 'c' ],
                        [ 50, null ],
                        [ 60, 'c' ],
                        [ 70, 'd' ],
                        [ 80, 'c' ]
                    ],
                    {
                        seriesLayoutBy: 'column',
                        sourceHeader: 0,
                        dimensions: null
                    },
                    SOURCE_FORMAT_ARRAY_ROWS
                );
                list.initData(source);

                doChecks(list);
            })