test('falls back to scroll for plain legends with overlong labels', () => {
    const longLegendChartProps = new ChartProps({
      formData: {
        colorScheme: 'bnbColors',
        datasource: '3__table',
        granularity_sqla: 'ds',
        metric: 'sum__num',
        groupby: ['category'],
        viz_type: 'pie',
        legendType: LegendType.Plain,
        legendOrientation: LegendOrientation.Top,
        showLegend: true,
      } as SqlaFormData,
      width: 320,
      height: 600,
      queriesData: [
        {
          data: [
            {
              category: 'This is a very long pie legend label one',
              sum__num: 10,
            },
            {
              category: 'This is a very long pie legend label two',
              sum__num: 20,
            },
            {
              category: 'This is a very long pie legend label three',
              sum__num: 30,
            },
          ],
        },
      ],
      theme: supersetTheme,
    });

    const transformed = transformProps(
      longLegendChartProps as EchartsPieChartProps,
    );

    expect((transformed.echartOptions.legend as any).type).toBe(
      LegendType.Scroll,
    );
  })