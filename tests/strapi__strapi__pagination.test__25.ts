test('Transforms start to pagination info', () => {
    const total = 100;
    const paginationInfo = transformPagedPaginationInfo({ start: 10 }, total);

    expect(paginationInfo).toEqual({
      page: 1,
      pageSize: total, // Applies total as pageSize
      pageCount: 1,
      total,
    });
  })