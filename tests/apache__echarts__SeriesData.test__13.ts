it('should guess ordinal correctly', function () {
            const source = createSource([['A', 15], ['B', 25], ['C', 35]], {
                dimensions: ['A', 'B'],
                seriesLayoutBy: null,
                sourceHeader: false
            }, SOURCE_FORMAT_ORIGINAL);
            expect(source.dimensionsDefine[0].type).toEqual('ordinal');
        })