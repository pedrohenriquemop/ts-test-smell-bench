test('Uses 1 as limit', () => {
        const pagination = { limit: 0 };
        const defaultPagination = withDefaultPagination(pagination, { defaults, maxLimit });

        expect(defaultPagination).toEqual({
          start: 0,
          limit: 1,
        });
      })