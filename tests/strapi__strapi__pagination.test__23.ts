test('Transforms page to pagination info', () => {
    const total = 100;
    const paginationInfo = transformPagedPaginationInfo({ page: 2 }, total);

    expect(paginationInfo).toEqual({
      page: 2,
      pageSize: total, // Applies total as pageSize
      pageCount: 1,
      total,
    });
  })