test('Uses default limit', () => {
      const pagination = {};
      const defaultPagination = withDefaultPagination(pagination, { defaults });

      expect(defaultPagination).toEqual({
        start: 0,
        limit: defaultLimit,
      });
    })