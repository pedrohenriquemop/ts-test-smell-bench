test('Uses specified pageSize', () => {
        const pagination = { pageSize: 5 };
        const defaultPagination = withDefaultPagination(pagination, { defaults, maxLimit });

        expect(defaultPagination).toEqual({
          start: 0,
          limit: pagination.pageSize,
        });
      })