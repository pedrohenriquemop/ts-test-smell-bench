it('sanitizes extra query param that is array of scalars (e.g. tags)', async () => {
      const route = {
        request: {
          query: { tags: z.array(z.string()).transform((arr) => arr.map((s) => s.trim())) },
        },
      };
      const query = { filters: { id: 1 }, tags: ['  a  ', '  b  '] };
      const result = await sanitizers.query(query, schema, {
        strictParams: true,
        route,
      });
      expect(result).toHaveProperty('tags', ['a', 'b']);
    })