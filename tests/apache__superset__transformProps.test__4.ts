test('should be formatted using the number formatter', () => {
    expect(
      format({
        label_type: 'template',
        label_template: '{name}:{value}\n{percent}',
        number_format: ',d',
      }),
    ).toEqual('Tablet:123,456\n55.50%');
  })