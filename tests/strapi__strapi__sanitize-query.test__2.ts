it('keeps extra param from route when strictParams: true and Zod parses successfully', async () => {
      const route = {
        request: {
          query: { search: z.string().transform((s) => s.trim()) },
        },
      };
      const query = { filters: { id: 1 }, search: '  foo  ' };
      const result = await sanitizers.query(query, schema, {
        strictParams: true,
        route,
      });
      expect(result).toHaveProperty('search', 'foo');
      expect(result).toHaveProperty('filters');
    })