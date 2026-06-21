test('sort legend by data', () => {
    const chartProps = getChartProps({
      legendSort: null,
    });
    const transformed = transformProps(chartProps as EchartsPieChartProps);

    expect((transformed.echartOptions.legend as any).data).toEqual([
      'A foo, A bar',
      'D foo, D bar',
      'C foo, C bar',
      'B foo, B bar',
      'E foo, E bar',
    ]);
  })