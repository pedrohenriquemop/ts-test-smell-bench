test('Uses default limit', () => {
      const pagination = {};
      const defaultPagination = withDefaultPagination(pagination, { defaults, maxLimit });

      expect(defaultPagination).toEqual({
        start: 0,
        limit: defaultLimit,
      });
    })