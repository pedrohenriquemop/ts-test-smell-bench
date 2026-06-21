test('Transforms start and limit to pagination info', () => {
    const total = 100;
    const paginationInfo = transformPagedPaginationInfo({ start: 10, limit: 10 }, total);

    expect(paginationInfo).toEqual({
      page: 2,
      pageSize: 10,
      pageCount: 10,
      total,
    });
  })