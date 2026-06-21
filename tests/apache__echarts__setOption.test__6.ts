it('normalizeVisualRange', function (done) {
        chart.setOption({
            xAxis: {},
            yAxis: {},
            series: [{type: 'scatter', data: [[12, 223]]}],
            visualMap: [
                {type: 'continuous', inRange: {color: 'red'}},
                {type: 'continuous', inRange: {opacity: 0.4}},
                {type: 'piecewise', inRange: {color: 'red'}},
                {type: 'piecewise', inRange: {opacity: 0.4}},
                {type: 'piecewise', inRange: {symbol: 'diamond'}},
                {type: 'piecewise', inRange: {color: 'red'}, categories: ['a', 'b']},
                {type: 'piecewise', inRange: {color: {a: 'red'}}, categories: ['a', 'b']},
                {type: 'piecewise', inRange: {opacity: 0.4}, categories: ['a', 'b']}
            ]
        });

        const ecModel = getECModel(chart);

        function getVisual(idx: number, visualType: 'color' | 'opacity' | 'symbol') {
            return (ecModel.getComponent('visualMap', idx) as VisualMapModel)
                .targetVisuals.inRange[visualType].option.visual;
        }

        function makeCategoryVisual(...args: unknown[]) {
            const CATEGORY_DEFAULT_VISUAL_INDEX = -1;
            const arr = [];
            if (args[0] != null) {
                arr[CATEGORY_DEFAULT_VISUAL_INDEX] = args[0];
            }
            for (let i = 1; i < args.length; i++) {
                arr.push(args[i]);
            }
            return arr;
        }

        expect(getVisual(0, 'color')).toEqual(['red']);
        expect(getVisual(1, 'opacity')).toEqual([0.4, 0.4]);
        expect(getVisual(2, 'color')).toEqual(['red']);
        expect(getVisual(3, 'opacity')).toEqual([0.4, 0.4]);
        expect(getVisual(4, 'symbol')).toEqual(['diamond']);
        expect(getVisual(5, 'color')).toEqual(makeCategoryVisual('red'));
        expect(getVisual(6, 'color')).toEqual(makeCategoryVisual(null, 'red'));
        expect(getVisual(7, 'opacity')).toEqual(makeCategoryVisual(0.4));
        done();
    })