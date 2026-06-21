it('base', function () {
            // Remove dupliate between A and B
            expect(compressBatches(
                [item(3, 4), item(3, 5), item(4, 5)],
                [item(4, 6), item(4, 5), item(3, 3), item(3, 4)]
            )).toEqual([
                [item('3', [5])],
                [item('3', [3]), item('4', [6])]
            ]);

            // Compress
            expect(compressBatches(
                [item(3, 4), item(3, 6), item(3, 5), item(4, 5)],
                [item(4, 6), item(4, 5), item(3, 3), item(3, 4), item(4, 7)]
            )).toEqual([
                [item('3', [5, 6])],
                [item('3', [3]), item('4', [6, 7])]
            ]);

            // Remove duplicate in themselves
            expect(compressBatches(
                [item(3, 4), item(3, 6), item(3, 5), item(4, 5)],
                [item(4, 6), item(4, 5), item(3, 3), item(3, 4), item(4, 7), item(4, 6)]
            )).toEqual([
                [item('3', [5, 6])],
                [item('3', [3]), item('4', [6, 7])]
            ]);

            // dataIndex is array
            expect(compressBatches(
                [item(3, [4, 5, 8]), item(4, 4), item(3, [5, 7, 7])],
                [item(3, [8, 9])]
            )).toEqual([
                [item('3', [4, 5, 7]), item('4', [4])],
                [item('3', [9])]
            ]);

            // empty
            expect(compressBatches(
                [item(3, [4, 5, 8]), item(4, 4), item(3, [5, 7, 7])],
                []
            )).toEqual([
                [item('3', [4, 5, 7, 8]), item('4', [4])],
                []
            ]);
            expect(compressBatches(
                [],
                [item(3, [4, 5, 8]), item(4, 4), item(3, [5, 7, 7])]
            )).toEqual([
                [],
                [item('3', [4, 5, 7, 8]), item('4', [4])]
            ]);

            // should not has empty array
            expect(compressBatches(
                [item(3, [4, 5, 8])],
                [item(3, [4, 5, 8])]
            )).toEqual([
                [],
                []
            ]);
        })