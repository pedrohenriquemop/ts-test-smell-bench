test('should parse orderby if needed', () => {
    expect(
      extractQueryFields({
        columns: ['a'],
        order_by_cols: ['["foo",false]', '["bar",true]'],
        orderby: [['abc', true]],
      }),
    ).toEqual({
      columns: ['a'],
      metrics: [],
      orderby: [
        ['foo', false],
        ['bar', true],
        ['abc', true],
      ],
    });
  })