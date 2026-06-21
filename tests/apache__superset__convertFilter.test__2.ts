test('should convert set filter', () => {
    expect(
      convertFilter({
        expressionType: 'SIMPLE',
        clause: 'WHERE',
        subject: 'toppings',
        operator: 'IN',
        comparator: ['boba', 'grass jelly'],
      }),
    ).toEqual({
      col: 'toppings',
      op: 'IN',
      val: ['boba', 'grass jelly'],
    });
  })