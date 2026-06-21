it('namesMoreThanDimCount', function () {
        const sysDims = [
            {
                'name': 'x',
                'type': 'ordinal' as const,
                'otherDims': {
                    'tooltip': false as const,
                    'itemName': 0
                },
                'dimsDef': [
                    'base'
                ]
            },
            {
                'name': 'y',
                'type': 'float' as const,
                'dimsDef': [
                    'open',
                    'close',
                    'lowest',
                    'highest'
                ]
            }
        ];

        const source = createSource(
            [
                [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
            ],
            {
                seriesLayoutBy: SERIES_LAYOUT_BY_COLUMN,
                sourceHeader: 0,
                dimensions: void 0
            },
            SOURCE_FORMAT_ARRAY_ROWS
        );

        const opt = {
            'coordDimensions': sysDims,
            'dimensionsDefine': [
                {
                    'name': 'date',
                    'displayName': 'date'
                },
                {
                    'name': 'open',
                    'displayName': 'open'
                },
                {
                    'name': 'high',
                    'displayName': 'high'
                },
                {
                    'name': 'low',
                    'displayName': 'low'
                },
                {
                    'name': 'close',
                    'displayName': 'close'
                },
                {
                    'name': 'volume',
                    'displayName': 'volume'
                },
                {
                    'name': 'haOpen',
                    'displayName': 'haOpen'
                },
                {
                    'name': 'haHigh',
                    'displayName': 'haHigh'
                },
                {
                    'name': 'haLow',
                    'displayName': 'haLow'
                },
                {
                    'name': 'haClose',
                    'displayName': 'haClose'
                },
                {
                    'name': 'sma9',
                    'displayName': 'sma9'
                }
            ],
            'encodeDefine': {
                'x': 'date',
                'y': [
                    'haOpen',
                    'haClose',
                    'haLow',
                    'haHigh'
                ],
                'tooltip': [
                    'open',
                    'high',
                    'low',
                    'close'
                ]
            },
            'dimensionsCount': 5
        };

        const result: SeriesDimensionDefine[] = [
            {
                'otherDims': {
                    'tooltip': false,
                    'itemName': 0
                },
                'displayName': 'date',
                'name': 'date',
                'coordDim': 'x',
                'coordDimIndex': 0,
                'type': 'ordinal',
                'storeDimIndex': 0
            },
            {
                'otherDims': {
                    'tooltip': 0
                },
                'displayName': 'open',
                'name': 'open',
                'coordDim': 'value',
                'coordDimIndex': 0,
                'isExtraCoord': true,
                'storeDimIndex': 1
            },
            {
                'otherDims': {
                    'tooltip': 1
                },
                'displayName': 'high',
                'name': 'high',
                'coordDim': 'value0',
                'coordDimIndex': 0,
                'isExtraCoord': true,
                'storeDimIndex': 2
            },
            {
                'otherDims': {
                    'tooltip': 2
                },
                'displayName': 'low',
                'name': 'low',
                'coordDim': 'value1',
                'coordDimIndex': 0,
                'isExtraCoord': true,
                'storeDimIndex': 3
            },
            {
                'otherDims': {
                    'tooltip': 3
                },
                'displayName': 'close',
                'name': 'close',
                'coordDim': 'value2',
                'coordDimIndex': 0,
                'isExtraCoord': true,
                'storeDimIndex': 4
            },
            {
                'otherDims': {},
                'displayName': 'volume',
                'name': 'volume',
                'coordDim': 'value3',
                'coordDimIndex': 0,
                'isExtraCoord': true,
                'storeDimIndex': 5
            },
            {
                'otherDims': {},
                'displayName': 'haOpen',
                'name': 'haOpen',
                'coordDim': 'y',
                'coordDimIndex': 0,
                'type': 'float',
                'storeDimIndex': 6
            },
            {
                'otherDims': {},
                'displayName': 'haHigh',
                'name': 'haHigh',
                'coordDim': 'y',
                'coordDimIndex': 3,
                'type': 'float',
                'storeDimIndex': 7
            },
            {
                'otherDims': {},
                'displayName': 'haLow',
                'name': 'haLow',
                'coordDim': 'y',
                'coordDimIndex': 2,
                'type': 'float',
                'storeDimIndex': 8
            },
            {
                'otherDims': {},
                'displayName': 'haClose',
                'name': 'haClose',
                'coordDim': 'y',
                'coordDimIndex': 1,
                'type': 'float',
                'storeDimIndex': 9
            },
            {
                'otherDims': {},
                'displayName': 'sma9',
                'name': 'sma9',
                'coordDim': 'value4',
                'coordDimIndex': 0,
                'isExtraCoord': true,
                'storeDimIndex': 10
            }
        ];

        expect(doCreateDimensions(source, opt)).toEqual(result.map(a => new SeriesDimensionDefine(a)));
    })