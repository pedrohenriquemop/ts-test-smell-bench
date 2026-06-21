test('sort legend by label descending', () => {
    const chartProps = getChartProps({
      legendSort: 'desc',
    });
    const transformed = transformProps(chartProps as EchartsPieChartProps);

    expect((transformed.echartOptions.legend as any).data).toEqual([
      'E foo, E bar',
      'D foo, D bar',
      'C foo, C bar',
      'B foo, B bar',
      'A foo, A bar',
    ]);
  })