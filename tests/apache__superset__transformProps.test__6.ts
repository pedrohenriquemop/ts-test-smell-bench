test('should center total text when legend is on the right', () => {
    const props = getChartPropsWithLegend(true, true, 'right', true);
    const transformed = transformProps(props);

    expect(transformed.echartOptions.graphic).toEqual(
      expect.objectContaining({
        type: 'text',
        left: expect.stringMatching(/^\d+(\.\d+)?%$/),
        top: 'middle',
        style: expect.objectContaining({
          text: expect.stringContaining('Total:'),
        }),
      }),
    );

    // The left position should be less than 50% (shifted left)
    const leftValue = parseFloat(
      (transformed.echartOptions.graphic as any).left.replace('%', ''),
    );
    expect(leftValue).toBeLessThan(50);
    expect(leftValue).toBeGreaterThan(30); // Should be reasonable positioning
  })