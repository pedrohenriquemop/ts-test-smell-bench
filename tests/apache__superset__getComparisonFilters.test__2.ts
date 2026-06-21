test('handles no time range filters', () => {
    const result = getComparisonFilters(
      {
        ...form_data,
        adhoc_filters: [
          {
            expressionType: 'SIMPLE',
            subject: 'address_line1',
            operator: 'IN',
            comparator: ['7734 Strong St.'],
            clause: 'WHERE',
            isExtra: false,
          },
        ],
      },
      {},
    );

    const expectedFilters = [
      {
        expressionType: 'SIMPLE',
        subject: 'address_line1',
        operator: 'IN',
        comparator: ['7734 Strong St.'],
        clause: 'WHERE',
        isExtra: false,
      },
    ];
    expect(result.length).toEqual(1);
    expect(result[0]).toEqual(expectedFilters[0]);
  })