test('Transforms page and pageSize to pagination info', () => {
    const total = 100;
    const paginationInfo = transformOffsetPaginationInfo({ page: 2, pageSize: 10 }, total);

    expect(paginationInfo).toEqual({
      start: 10,
      limit: 10,
      total,
    });
  })