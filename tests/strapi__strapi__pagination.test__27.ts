test('Transforms page to pagination info', () => {
    const total = 100;
    const paginationInfo = transformOffsetPaginationInfo({ page: 2 }, total);

    expect(paginationInfo).toEqual({
      start: 100,
      limit: total, // Applies total as limit
      total,
    });
  })