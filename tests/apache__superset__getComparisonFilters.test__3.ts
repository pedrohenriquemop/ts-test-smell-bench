test('If adhoc_filter is undefrined the code wont break', () => {
    const result = getComparisonFilters(
      {
        ...form_data,
        adhoc_filters: undefined,
      },
      {},
    );

    expect(result).toEqual([]);
  })