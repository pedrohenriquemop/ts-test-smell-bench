test('Transforms start and limit to pagination info', () => {
    const total = 100;
    const paginationInfo = transformOffsetPaginationInfo({ start: 10, limit: 10 }, total);

    expect(paginationInfo).toEqual({
      start: 10,
      limit: 10,
      total,
    });
  })