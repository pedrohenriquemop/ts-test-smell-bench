test('should center total text when legend is on bottom', () => {
    const props = getChartPropsWithLegend(true, true, 'bottom', true);
    const transformed = transformProps(props);

    expect(transformed.echartOptions.graphic).toEqual(
      expect.objectContaining({
        type: 'text',
        left: 'center',
        top: expect.stringMatching(/^\d+(\.\d+)?%$/),
      }),
    );

    // The top position should be adjusted for bottom legend
    const topValue = parseFloat(
      (transformed.echartOptions.graphic as any).top.replace('%', ''),
    );
    expect(topValue).toBeLessThan(50); // Shifted up for bottom legend
  })