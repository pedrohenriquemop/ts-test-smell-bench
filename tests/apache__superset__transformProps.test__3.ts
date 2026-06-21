test('should generate a valid pie chart label with template', () => {
    expect(
      format({
        label_type: 'template',
        label_template: '{name}:{value}\n{percent}',
      }),
    ).toEqual('Tablet:123k\n55.50%');
  })