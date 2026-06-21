test('Uses apecified limit', () => {
        const pagination = { limit: 999 };
        const defaultPagination = withDefaultPagination(pagination, { defaults });

        expect(defaultPagination).toEqual({
          start: 0,
          limit: 999,
        });
      })