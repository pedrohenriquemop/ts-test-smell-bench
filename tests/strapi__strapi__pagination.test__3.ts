test('Uses 1 as pageSize', () => {
        const pagination = { pageSize: 0 };
        const defaultPagination = withDefaultPagination(pagination, { defaults, maxLimit });

        expect(defaultPagination).toEqual({
          start: 0,
          limit: 1,
        });
      })