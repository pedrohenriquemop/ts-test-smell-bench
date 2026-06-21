test('should handle adhoc columns with label', () => {
    expect(
      getColumnLabel({
        sqlExpression: "case when 1 then 'a' else 'b' end",
        label: 'my col',
        expressionType: 'SQL',
      }),
    ).toEqual('my col');
  })