test('Uses specified pageSize', () => {
        const pagination = { pageSize: 5 };
        const defaultPagination = withDefaultPagination(pagination, { defaults });

        expect(defaultPagination).toEqual({
          start: 0,
          limit: pagination.pageSize,
        });
      })