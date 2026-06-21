it('expandOrShrinkRect', function () {

            const rect1 = {x: 100, y: 200, width: 300, height: 400};
            expandOrShrinkRect(rect1, [10, 20, 30, 40], false, true);
            expect(rect1).toEqual({x: 60, y: 190, width: 360, height: 440});

            const rect1b = {x: 100, y: 200, width: 300, height: 400};
            expandOrShrinkRect(rect1b, [-10, -20, -30, -40], false, true);
            expect(rect1b).toEqual({x: 100, y: 200, width: 300, height: 400});

            const rect1c = {x: 100, y: 200, width: 300, height: 400};
            expandOrShrinkRect(rect1c, [-10, -20, -30, -40], true, true);
            expect(rect1c).toEqual({x: 100, y: 200, width: 300, height: 400});

            const rect1d = {x: 100, y: 200, width: 300, height: 400};
            expandOrShrinkRect(rect1d, [10, 20, 30, 40], true, true);
            expect(rect1d).toEqual({x: 140, y: 210, width: 240, height: 360});

            const rect1e = {x: 100, y: 200, width: 300, height: 400};
            expandOrShrinkRect(rect1e, [10, 200, 30, 120], true, true);
            expect(rect1e).toEqual({x: 212.5, y: 210, width: 0, height: 360});

            const rect1f = {x: 100, y: 200, width: 300, height: 400};
            expandOrShrinkRect(rect1f, [200, 20, 300, 40], true, true);
            expect(rect1f).toEqual({x: 140, y: 360, width: 240, height: 0});

            const rect2 = {x: 100, y: 200, width: 300, height: 400};
            expandOrShrinkRect(rect2, [0, 0, 0, 0], false, true);
            expect(rect2).toEqual({x: 100, y: 200, width: 300, height: 400});

            const rect3 = {x: 0, y: 100, width: 200, height: 300};
            expandOrShrinkRect(rect3, [-10, -20, -30, -40], false, false);
            expect(rect3).toEqual({x: 40, y: 110, width: 140, height: 260});

            const rect4 = {x: 0, y: 100, width: 5, height: 30};
            expandOrShrinkRect(rect4, [-10, 0, -40, -10], false, false);
            expect(rect4).toEqual({x: 5, y: 106, width: 0, height: 0});

            const rect5 = {x: 10, y: 100, width: 5, height: 0};
            expandOrShrinkRect(rect5, [-10, -10, -40, 0], false, false);
            expect(rect5).toEqual({x: 10, y: 100, width: 0, height: 0});

            const rect6 = {x: 5, y: 0, width: 0, height: 0};
            expandOrShrinkRect(rect6, [10, -10, 40, 20], false, false);
            expect(rect6).toEqual({x: -15, y: -10, width: 10, height: 50});

            const rect7 = {x: 5, y: 0, width: 15, height: 20};
            expandOrShrinkRect(rect7, [-45, -50, 10, 20], false, false);
            expect(rect7).toEqual({x: -15, y: 30, width: 0, height: 0});

            const rect8 = {x: 100, y: NaN, width: 300, height: NaN};
            expandOrShrinkRect(rect8, [10, 20, 30, 40], false, true);
            expect(rect8).toEqual({x: 60, y: NaN, width: 360, height: NaN});

            const rect8b = {x: NaN, y: 200, width: NaN, height: 400};
            expandOrShrinkRect(rect8b, [10, 20, 30, 40], false, true);
            expect(rect8b).toEqual({x: NaN, y: 190, width: NaN, height: 440});

            const rect9 = {x: 100, y: 200, width: 300, height: 400};
            expandOrShrinkRect(rect9, 10, false, true);
            expect(rect9).toEqual({x: 90, y: 190, width: 320, height: 420});

            const rect10 = {x: 100, y: 200, width: 300, height: 400};
            expandOrShrinkRect(rect10, 10, true, true);
            expect(rect10).toEqual({x: 110, y: 210, width: 280, height: 380});

            const rect11 = {x: 100, y: 200, width: 300, height: 400};
            expandOrShrinkRect(rect11, -10, false, true);
            expect(rect11).toEqual({x: 100, y: 200, width: 300, height: 400});

            const rect11b = {x: 100, y: 200, width: 300, height: 400};
            expandOrShrinkRect(rect11b, -10, true, true);
            expect(rect11b).toEqual({x: 100, y: 200, width: 300, height: 400});
        })