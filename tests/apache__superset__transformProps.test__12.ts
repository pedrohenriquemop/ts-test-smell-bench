test('should not show total graphic when showTotal is false', () => {
    const props = getChartPropsWithLegend(false, true, 'right', true);
    const transformed = transformProps(props);

    expect(transformed.echartOptions.graphic).toBeNull();
  })