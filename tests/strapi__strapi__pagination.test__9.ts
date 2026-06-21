test('Uses maxLimit as limit', () => {
        const pagination = { limit: -1 };
        const defaultPagination = withDefaultPagination(pagination, { defaults, maxLimit });

        expect(defaultPagination).toEqual({
          start: 0,
          limit: maxLimit,
        });
      })