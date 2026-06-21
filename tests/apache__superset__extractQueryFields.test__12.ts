test('should throw error if parse orderby failed', () => {
    expect(() => {
      extractQueryFields({
        orderby: ['ccc'],
      });
    }).toThrow('invalid orderby');
  })