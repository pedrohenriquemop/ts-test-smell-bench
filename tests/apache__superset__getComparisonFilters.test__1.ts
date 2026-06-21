test('Updates the time_range if the filter if extra form data is passed', () => {
    const result = getComparisonFilters(form_data, mockExtraFormData);

    const expectedFilters = [
      {
        clause: 'WHERE',
        comparator: 'new and cool range from extra form data',
        datasourceWarning: false,
        expressionType: 'SIMPLE',
        filterOptionName: 'filter_8274fo9pogn_ihi8x28o7a',
        isExtra: false,
        isNew: false,
        operator: 'TEMPORAL_RANGE',
        sqlExpression: null,
        subject: 'order_date',
      } as any,
    ];

    expect(result.length).toEqual(1);
    expect(result[0]).toEqual(expectedFilters[0]);
  })