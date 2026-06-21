test('should extract groupby as columns and set empty metrics', () => {
    expect(extractQueryFields({ groupby: 'col_1' })).toEqual({
      columns: ['col_1'],
      metrics: [],
      orderby: undefined,
    });
  })