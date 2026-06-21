test('should extract custom columns fields', () => {
    expect(
      extractQueryFields(
        { series: 'col_1', metric: 'metric_1' },
        { series: 'groupby' },
      ),
    ).toEqual({
      columns: ['col_1'],
      metrics: ['metric_1'],
      orderby: undefined,
    });
  })