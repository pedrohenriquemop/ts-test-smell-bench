test('Transforms start to pagination info', () => {
    const total = 100;
    const paginationInfo = transformOffsetPaginationInfo({ start: 10 }, total);

    expect(paginationInfo).toEqual({
      start: 10,
      limit: total, // Applies total as limit
      total,
    });
  })