test('should convert binary filter', () => {
    expect(
      convertFilter({
        expressionType: 'SIMPLE',
        clause: 'WHERE',
        subject: 'topping',
        operator: '==',
        comparator: 'grass jelly',
      }),
    ).toEqual({
      col: 'topping',
      op: '==',
      val: 'grass jelly',
    });
  })