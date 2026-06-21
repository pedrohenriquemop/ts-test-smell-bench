test('should be compatible with ECharts raw variable syntax', () => {
    expect(
      format({
        label_type: 'template',
        label_template: '{b}:{c}\n{d}',
        number_format: ',d',
      }),
    ).toEqual('Tablet:123456\n55.5');
  })