test('should ignore null values', () => {
    expect(
      extractQueryFields({ series: ['a'], columns: null }).columns,
    ).toEqual(['a']);
  })