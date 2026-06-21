it('updateCovers inherits the enabled brush style', function () {
        const controller = new BrushController(chart.getZr()).mount();
        const brushStyle = {
            fill: 'rgba(255, 0, 0, 0.35)',
            stroke: 'rgb(255, 0, 0)',
            lineWidth: 6,
            opacity: 0.45
        };

        controller
            .enableBrush({
                brushType: 'lineX',
                brushStyle: brushStyle,
                transformable: false,
                removeOnClick: true
            })
            .updateCovers([{
                brushType: 'lineX',
                range: [20, 60]
            }]);

        // @ts-ignore access internal state for behavior verification.
        const cover = controller._covers[0];
        // @ts-ignore access internal state for behavior verification.
        const brushOption = cover.__brushOption;
        const mainEl = cover.childAt(0) as Rect;

        expect(brushOption.brushStyle).toEqual(brushStyle);
        expect(brushOption.transformable).toEqual(false);
        expect(brushOption.removeOnClick).toEqual(true);
        expect(mainEl.style.fill).toEqual(brushStyle.fill);
        expect(mainEl.style.stroke).toEqual(brushStyle.stroke);
        expect(mainEl.style.lineWidth).toEqual(brushStyle.lineWidth);
        expect(mainEl.style.opacity).toEqual(brushStyle.opacity);
    })