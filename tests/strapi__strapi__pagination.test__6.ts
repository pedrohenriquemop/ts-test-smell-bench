test('Uses specified limit', () => {
        const pagination = { limit: 5 };
        const defaultPagination = withDefaultPagination(pagination, { defaults, maxLimit });

        expect(defaultPagination).toEqual({
          start: 0,
          limit: pagination.limit,
        });
      })