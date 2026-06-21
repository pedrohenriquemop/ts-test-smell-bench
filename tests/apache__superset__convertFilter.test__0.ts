test('should handle unary filter', () => {
    expect(
      convertFilter({
        expressionType: 'SIMPLE',
        clause: 'WHERE',
        subject: 'topping',
        operator: 'IS NOT NULL',
      }),
    ).toEqual({
      col: 'topping',
      op: 'IS NOT NULL',
    });
  })