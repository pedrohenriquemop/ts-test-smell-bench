it('omits extra param from result when Zod safeParse fails (invalid value)', async () => {
      const route = {
        request: {
          query: { search: z.string().min(1) },
        },
      };
      const query = { filters: { id: 1 }, search: '' };
      const result = await sanitizers.query(query, schema, {
        strictParams: true,
        route,
      });
      expect(result).not.toHaveProperty('search');
      expect(result).toHaveProperty('filters');
    })