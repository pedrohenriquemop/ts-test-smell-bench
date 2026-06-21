it('differentSysDims', function () {
        function doTest(
            source: ParametersOfCreateDimensions[0],
            opt: ParametersOfCreateDimensions[1],
            result: SeriesDimensionDefine[]
        ) {
            expect(doCreateDimensions(source, opt)).toEqual(result.map(a => new SeriesDimensionDefine(a)));
        }

        const data = [
            ['iw', 332, 4434, 323, 59],
            ['vrr', 44, 11, 144, 55]
        ];

        doTest(
            data, { coordDimensions: ['x', 'y'] },
            [
                {
                    'otherDims': {},
                    'coordDim': 'x',
                    'coordDimIndex': 0,
                    'name': 'x',
                    'type': 'ordinal',
                    'storeDimIndex': 0
                },
                {
                    'otherDims': {},
                    'coordDim': 'y',
                    'coordDimIndex': 0,
                    'name': 'y',
                    'storeDimIndex': 1
                }
            ]
        );

        doTest(
            data, { coordDimensions: ['value'] },
            [
                {
                    'otherDims': {},
                    'coordDim': 'value',
                    'coordDimIndex': 0,
                    'name': 'value',
                    'type': 'ordinal',
                    'storeDimIndex': 0
                }
            ]
        );

        doTest(
            data,
            { coordDimensions: [{name: 'time', type: 'time' as const}, 'value'] },
            [
                {
                    'otherDims': {},
                    'name': 'time',
                    'type': 'time',
                    'coordDimIndex': 0,
                    'ordinalMeta': undefined,
                    'coordDim': 'time',
                    'storeDimIndex': 0
                },
                {
                    'otherDims': {},
                    'coordDim': 'value',
                    'coordDimIndex': 0,
                    'name': 'value',
                    'storeDimIndex': 1
                }
            ]
        );

        doTest(
            data, {
                coordDimensions: [{
                    name: 'y',
                    otherDims: {
                        tooltip: false
                    },
                    dimsDef: ['base']
                }, {
                    name: 'x',
                    dimsDef: ['open', 'close']
                }]
            },
            [
                {
                    'otherDims': {
                        'tooltip': false
                    },
                    'name': 'base',
                    'defaultTooltip': undefined,
                    'coordDimIndex': 0,
                    'coordDim': 'y',
                    'type': 'ordinal',
                    'displayName': 'base',
                    'ordinalMeta': undefined,
                    'storeDimIndex': 0
                },
                {
                    'otherDims': {},
                    'name': 'open',
                    'ordinalMeta': undefined,
                    'defaultTooltip': undefined,
                    'coordDimIndex': 0,
                    'coordDim': 'x',
                    'displayName': 'open',
                    'storeDimIndex': 1
                }
            ]
        );

        doTest(
            data, {
                dimensionsDefine: ['基础', '打开', '关闭'],
                coordDimensions: [{
                    name: 'y',
                    otherDims: {
                        tooltip: false
                    },
                    dimsDef: ['base']
                }, {
                    name: 'x',
                    dimsDef: ['open', 'close']
                }],
                encodeDefine: {
                    tooltip: [1, 2, 0]
                }
            },
            [
                {
                    'otherDims': {
                        'tooltip': 2
                    },
                    'name': '基础',
                    'displayName': '基础',
                    'ordinalMeta': undefined,
                    'coordDimIndex': 0,
                    'coordDim': 'y',
                    'type': 'ordinal',
                    'storeDimIndex': 0
                },
                {
                    'otherDims': {
                        'tooltip': 0
                    },
                    'name': '打开',
                    'displayName': '打开',
                    'coordDimIndex': 0,
                    'ordinalMeta': undefined,
                    'coordDim': 'x',
                    'storeDimIndex': 1
                },
                {
                    'otherDims': {
                        'tooltip': 1
                    },
                    'name': '关闭',
                    'displayName': '关闭',
                    'ordinalMeta': undefined,
                    'coordDimIndex': 1,
                    'coordDim': 'x',
                    'storeDimIndex': 2
                }
            ]
        );

        doTest(
            data, {
                coordDimensions: [{
                    name: 'y',
                    otherDims: {
                        tooltip: false
                    },
                    dimsDef: ['base']
                }, {
                    name: 'x',
                    dimsDef: ['open', 'close']
                }],
                dimensionsDefine: ['基础', null, '关闭'],
                encodeDefine: {
                    x: [0, 4]
                }
            },
            [
                {
                    'otherDims': {},
                    'displayName': '基础',
                    'name': '基础',
                    'coordDimIndex': 0,
                    'coordDim': 'x',
                    'ordinalMeta': undefined,
                    'type': 'ordinal',
                    'storeDimIndex': 0
                },
                {
                    'otherDims': {
                        'tooltip': false
                    },
                    'name': 'base',
                    'displayName': 'base',
                    'ordinalMeta': undefined,
                    'defaultTooltip': undefined,
                    'coordDimIndex': 0,
                    'coordDim': 'y',
                    'storeDimIndex': 1
                },
                {
                    'otherDims': {},
                    'name': '关闭',
                    'displayName': '关闭',
                    'coordDimIndex': 0,
                    'isExtraCoord': true,
                    'coordDim': 'value',
                    'storeDimIndex': 2
                }
            ]
        );

    })