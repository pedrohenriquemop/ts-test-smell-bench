test('sort legend by label ascending', () => {
    const chartProps = getChartProps({
      legendSort: 'asc',
    });
    const transformed = transformProps(chartProps as EchartsPieChartProps);

    expect((transformed.echartOptions.legend as any).data).toEqual([
      'A foo, A bar',
      'B foo, B bar',
      'C foo, C bar',
      'D foo, D bar',
      'E foo, E bar',
    ]);
  })