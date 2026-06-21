it('has_ordinalMeta', function () {
                const ordinalMetaP = new OrdinalMeta({
                    categories: [],
                    needCollect: true,
                    deduplication: true
                });
                const ordinalMetaQ = new OrdinalMeta({
                    categories: [],
                    needCollect: true,
                    deduplication: true
                });
                testArrayRowsInSource([
                    { name: 'x', type: 'number' },
                    { name: 'p', type: 'ordinal', otherDims: { itemId: 0 }, ordinalMeta: ordinalMetaP },
                    { name: 'q', type: 'ordinal', otherDims: { itemName: 0 }, ordinalMeta: ordinalMetaQ }
                ]);
            })