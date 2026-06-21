test('should remove duplicate metrics', () => {
    expect(
      extractQueryFields({
        metrics: ['col_1', { ...NUM_METRIC }, { ...NUM_METRIC }],
      }),
    ).toEqual({
      columns: [],
      metrics: ['col_1', NUM_METRIC],
      orderby: undefined,
    });
  })