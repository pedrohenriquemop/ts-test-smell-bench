it('rigid_move', function () {

            expect(sliderMove(2, [20, 30], [10, 50], 'all')).toEqual([22, 32]);
            expect(sliderMove(200, [20, 30], [10, 50], 'all')).toEqual([40, 50]);
            expect(sliderMove(-2, [30, 40], [10, 50], 'all')).toEqual([28, 38]);
            expect(sliderMove(-2, [10, 20], [10, 50], 'all')).toEqual([10, 20]);

        })