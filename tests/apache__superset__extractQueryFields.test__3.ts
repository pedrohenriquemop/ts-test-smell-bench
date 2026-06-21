test('should extract columns', () => {
    expect(extractQueryFields({ columns: 'col_1' })).toEqual({
      columns: ['col_1'],
      metrics: [],
      orderby: undefined,
    });
  })