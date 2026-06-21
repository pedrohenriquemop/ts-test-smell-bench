test('should ignore groupby and metrics when in raw QueryMode', () => {
    expect(
      extractQueryFields({
        columns: ['a'],
        groupby: ['b'],
        metric: ['m'],
        query_mode: QueryMode.Raw,
      }),
    ).toEqual({
      columns: ['a'],
      metrics: undefined,
      orderby: undefined,
    });
  })