test('should center total text when legend is on the left', () => {
    const props = getChartPropsWithLegend(true, true, 'left', true);
    const transformed = transformProps(props);

    expect(transformed.echartOptions.graphic).toEqual(
      expect.objectContaining({
        type: 'text',
        left: expect.stringMatching(/^\d+(\.\d+)?%$/),
        top: 'middle',
      }),
    );

    // The left position should be greater than 50% (shifted right)
    const leftValue = parseFloat(
      (transformed.echartOptions.graphic as any).left.replace('%', ''),
    );
    expect(leftValue).toBeGreaterThan(50);
    expect(leftValue).toBeLessThan(70); // Should be reasonable positioning
  })