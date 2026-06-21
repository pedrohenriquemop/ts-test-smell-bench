test('should group single value to arrays', () => {
    expect(
      extractQueryFields({
        metric: 'my_metric',
        columns: 'abc',
        orderby: '["ccc",true]',
      }),
    ).toEqual({
      metrics: ['my_metric'],
      columns: ['abc'],
      orderby: [['ccc', true]],
    });
  })