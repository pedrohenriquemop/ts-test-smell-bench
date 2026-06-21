it('keeps unrecognized keys when strictParams: false', async () => {
      const query = { filters: { id: 1 }, where: { id: 1 } };
      const result = await sanitizers.query(query, schema, { strictParams: false });
      expect(result).toHaveProperty('where');
    })