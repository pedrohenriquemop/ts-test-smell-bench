test('should combine field aliases', () => {
    expect(
      extractQueryFields(
        {
          metric: 'metric_1',
          metric_2: 'metric_2',
          my_custom_metric: 'my_custom_metric',
        },
        { my_custom_metric: 'metrics' },
      ).metrics,
    ).toEqual(['metric_1', 'metric_2', 'my_custom_metric']);
  })