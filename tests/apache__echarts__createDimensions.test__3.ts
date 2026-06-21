it('dimsDef', function () {
        function doTest(
            source: ParametersOfCreateDimensions[0],
            opt: ParametersOfCreateDimensions[1],
            result: SeriesDimensionDefine[]
        ) {
            expect(doCreateDimensions(source, opt)).toEqual(result.map(a => new SeriesDimensionDefine(a)));
        }

        const data = [['iw', 332, 4434, 323, 59], ['vrr', 44, 11, 144, 55]];
        doTest(
            data,
            {
                dimensionsDefine: ['挨克思', null, '歪溜'],
                coordDimensions: ['x', 'y', 'value']
            },
            [
                {
                    'otherDims': {},
                    'displayName': '挨克思',
                    'name': '挨克思',
                    'type': 'ordinal',
                    'coordDim': 'x',
                    'coordDimIndex': 0,
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
                    'otherDims': {},
                    'displayName': '歪溜',
                    'name': '歪溜',
                    'coordDim': 'value',
                    'coordDimIndex': 0,
                    'storeDimIndex': 2
                }
            ]
        );

        doTest(
            data,
            {
                dimensionsDefine: ['挨克思', null, {type: 'ordinal' as const}],
                coordDimensions: ['x', 'y', 'value']
            }, // no name but only type
            [
                {
                    'otherDims': {},
                    'displayName': '挨克思',
                    'name': '挨克思',
                    'type': 'ordinal',
                    'coordDim': 'x',
                    'coordDimIndex': 0,
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
                    'otherDims': {},
                    'name': 'value',
                    'coordDim': 'value',
                    'type': 'ordinal',
                    'coordDimIndex': 0,
                    'storeDimIndex': 2
                }
            ]
        );

        doTest(
            data,
            {
                dimensionsDefine: [{name: '泰亩', type: 'ordinal'}, {name: '歪溜', type: 'float'}],
                coordDimensions: [{name: 'time', type: 'time' as const}, 'value']
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

        // Duplicate name
        doTest(
            data,
            {
                dimensionsDefine: [{name: '泰亩', type: 'ordinal'}, {name: '泰亩', type: 'float'}],
                coordDimensions: [{name: 'time', type: 'time' as const}, 'value']
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
                    'displayName': '泰亩',
                    'name': '泰亩0',
                    'type': 'float',
                    'coordDim': 'value',
                    'coordDimIndex': 0,
                    'storeDimIndex': 1
                }
            ]
        );
    })