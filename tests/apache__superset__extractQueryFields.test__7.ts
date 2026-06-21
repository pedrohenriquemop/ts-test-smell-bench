test('should merge custom groupby into columns', () => {
    expect(
      extractQueryFields(
        { groupby: 'col_1', series: 'col_2', metric: 'metric_1' },
        { series: 'groupby' },
      ),
    ).toEqual({
      columns: ['col_1', 'col_2'],
      metrics: ['metric_1'],
      orderby: undefined,
    });
  })