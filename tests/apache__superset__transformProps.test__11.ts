test('should handle regular pie chart (non-donut) positioning', () => {
    const props = getChartPropsWithLegend(true, true, 'right', false);
    const transformed = transformProps(props);

    expect(transformed.echartOptions.graphic).toEqual(
      expect.objectContaining({
        type: 'text',
        top: '0', // Non-donut charts use '0' as default top position
        left: expect.stringMatching(/^\d+(\.\d+)?%$/), // Should still adjust left for right legend
      }),
    );
  })