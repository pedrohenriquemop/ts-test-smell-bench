test('should ignore columns when in aggregate QueryMode', () => {
    expect(
      extractQueryFields({
        columns: ['a'],
        groupby: [],
        metric: ['m'],
        query_mode: QueryMode.Aggregate,
      }),
    ).toEqual({
      metrics: ['m'],
      columns: [],
      orderby: undefined,
    });
    expect(
      extractQueryFields({
        columns: ['a'],
        groupby: ['b'],
        metric: ['m'],
        query_mode: QueryMode.Aggregate,
      }),
    ).toEqual({
      metrics: ['m'],
      columns: ['b'],
      orderby: undefined,
    });
  })