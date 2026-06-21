test('Keeps the original adhoc_filters since no extra data was passed', () => {
    const result = getComparisonFilters(form_data, {});

    expect(result).toEqual(form_data.adhoc_filters);
  })