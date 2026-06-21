test('Uses maxLimit as pageSize', () => {
        const pagination = { pageSize: 999 };
        const defaultPagination = withDefaultPagination(pagination, { defaults, maxLimit });

        expect(defaultPagination).toEqual({
          start: 0,
          limit: maxLimit,
        });
      })