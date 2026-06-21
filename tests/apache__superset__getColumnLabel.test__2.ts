test('should handle adhoc columns without label', () => {
    expect(
      getColumnLabel({
        sqlExpression: "case when 1 then 'a' else 'b' end",
        expressionType: 'SQL',
      }),
    ).toEqual("case when 1 then 'a' else 'b' end");
  })