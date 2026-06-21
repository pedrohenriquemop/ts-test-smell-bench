test('should use default positioning when no legend is shown', () => {
    const props = getChartPropsWithLegend(true, false, 'right', true);
    const transformed = transformProps(props);

    expect(transformed.echartOptions.graphic).toEqual(
      expect.objectContaining({
        type: 'text',
        left: 'center',
        top: 'middle',
      }),
    );
  })