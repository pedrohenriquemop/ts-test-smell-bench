test('Transforms page and pageSize to pagination info', () => {
    const total = 100;
    const paginationInfo = transformPagedPaginationInfo({ page: 2, pageSize: 10 }, total);

    expect(paginationInfo).toEqual({
      page: 2,
      pageSize: 10,
      pageCount: 10,
      total,
    });
  })