test('should return default object', () => {
    expect(extractQueryFields({})).toEqual({
      columns: [],
      metrics: [],
      orderby: undefined,
    });
  })