test('generates Other category', () => {
    const chartProps = getChartProps({
      threshold_for_other: 20,
    });
    const transformed = transformProps(chartProps as EchartsPieChartProps);
    const series = transformed.echartOptions.series as PieSeriesOption[];
    const data = series[0].data as PieChartDataItem[];
    expect(data).toHaveLength(4);
    expect(data[0].value).toBe(3);
    expect(data[1].value).toBe(4);
    expect(data[2].value).toBe(5);
    expect(data[3].value).toBe(1 + 2);
    expect(data[3].name).toBe('Other');
    expect(data[3].isOther).toBe(true);
  })