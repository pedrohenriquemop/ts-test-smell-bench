it('encodeDef', function () {
        function doTest(
            source: ParametersOfCreateDimensions[0],
            opt: ParametersOfCreateDimensions[1],
            result: SeriesDimensionDefine[]
        ) {
            expect(doCreateDimensions(source, opt)).toEqual(result.map(a => new SeriesDimensionDefine(a)));
        }

        const data = [['iw', 332, 4434, 323, 'd8', 59], ['vrr', 44, 11, 144, '-', 55]];

        doTest(
            data,
            {
                encodeDefine: {
                    x: 2,
                    y: [1, 4],
                    tooltip: 2,
                    label: [3, 5]
                }
            },
            [
                {
                    'otherDims': {},
                    'coordDim': 'value',
                    'coordDimIndex': 0,
                    'name': 'value',
                    'isExtraCoord': true,
                    'type': 'ordinal',
                    'storeDimIndex': 0
                }
            ]
        );

        doTest(
            data,
            {
                dimensionsDefine: ['挨克思', null, '歪溜'],
                encodeDefine: {
                    x: 2,
                    y: [1, 4],
                    tooltip: 2,
                    label: [3, 5]
                }
            },
            [
                {
                    'otherDims': {},
                    'displayName': '挨克思',
                    'name': '挨克思',
                    'type': 'ordinal',
                    'coordDim': 'value',
                    'coordDimIndex': 0,
                    'isExtraCoord': true,
                    'storeDimIndex': 0
                },
                {
                    'otherDims': {},
                    'coordDim': 'y',
                    'coordDimIndex': 0,
                    'name': 'y',
                    'storeDimIndex': 1
                },
                {
                    'otherDims': {
                        'tooltip': 0
                    },
                    'displayName': '歪溜',
                    'name': '歪溜',
                    'coordDim': 'x',
                    'coordDimIndex': 0,
                    'storeDimIndex': 2
                }
            ]
        );

        doTest(
            data,
            {
                dimensionsDefine: ['挨克思', null, '歪溜'],
                coordDimensions: ['x', {name: 'y', type: 'time' as const}, 'z'],
                encodeDefine: {
                    x: 2,
                    y: [1, 4],
                    tooltip: 2,
                    label: [3, 5]
                }
            },
            [
                {
                    'otherDims': {},
                    'displayName': '挨克思',
                    'name': '挨克思',
                    'type': 'ordinal',
                    'coordDim': 'z',
                    'coordDimIndex': 0,
                    'storeDimIndex': 0
                },
                {
                    'otherDims': {},
                    'coordDim': 'y',
                    'coordDimIndex': 0,
                    'name': 'y',
                    'type': 'time',
                    'ordinalMeta': undefined,
                    'storeDimIndex': 1
                },
                {
                    'otherDims': {
                        'tooltip': 0
                    },
                    'displayName': '歪溜',
                    'name': '歪溜',
                    'coordDim': 'x',
                    'coordDimIndex': 0,
                    'storeDimIndex': 2
                }
            ]
        );

        doTest(
            data,
            {
                // dimsDef type 'ordinal' has higher priority then sysDims type 'time'.
                dimensionsDefine: [{name: '泰亩', type: 'ordinal'}, {name: '歪溜', type: 'float'}],
                coordDimensions: [{name: 'time', type: 'time' as const}, 'value'],
                encodeDefine: {
                    tooltip: 2
                }
            },
            [
                {
                    'otherDims': {},
                    'displayName': '泰亩',
                    'name': '泰亩',
                    'type': 'ordinal',
                    'ordinalMeta': undefined,
                    'coordDimIndex': 0,
                    'coordDim': 'time',
                    'storeDimIndex': 0
                },
                {
                    'otherDims': {},
                    'displayName': '歪溜',
                    'name': '歪溜',
                    'type': 'float',
                    'coordDim': 'value',
                    'coordDimIndex': 0,
                    'storeDimIndex': 1
                }
            ]
        );

        doTest(
            data,
            {
                // dimsDef type 'ordinal' has higher priority then sysDims type 'time'.
                dimensionsDefine: [{name: '泰亩', type: 'ordinal'}, {name: '歪溜', type: 'float'}],
                coordDimensions: [{name: 'time', type: 'time' as const}, 'value'],
                encodeDefine: {
                    tooltip: 2
                }
            },
            [
                {
                    'otherDims': {},
                    'displayName': '泰亩',
                    'name': '泰亩',
                    'type': 'ordinal',
                    'ordinalMeta': undefined,
                    'coordDimIndex': 0,
                    'coordDim': 'time',
                    'storeDimIndex': 0
                },
                {
                    'otherDims': {},
                    'displayName': '歪溜',
                    'name': '歪溜',
                    'type': 'float',
                    'coordDim': 'value',
                    'coordDimIndex': 0,
                    'storeDimIndex': 1
                }
            ]
        );

    })