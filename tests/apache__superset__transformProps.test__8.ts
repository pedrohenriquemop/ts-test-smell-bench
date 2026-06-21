test('should center total text when legend is on top', () => {
    const props = getChartPropsWithLegend(true, true, 'top', true);
    const transformed = transformProps(props);

    expect(transformed.echartOptions.graphic).toEqual(
      expect.objectContaining({
        type: 'text',
        left: 'center',
        top: expect.stringMatching(/^\d+(\.\d+)?%$/),
      }),
    );

    // The top position should be adjusted for top legend
    const topValue = parseFloat(
      (transformed.echartOptions.graphic as any).top.replace('%', ''),
    );
    expect(topValue).toBeGreaterThan(50); // Shifted down for top legend
  })