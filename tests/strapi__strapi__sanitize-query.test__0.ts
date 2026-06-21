it('strips unrecognized keys when strictParams: true', async () => {
      const query = { filters: { id: 1 }, where: { id: 1 } };
      const result = await sanitizers.query(query, schema, { strictParams: true });
      expect(result).not.toHaveProperty('where');
      expect(result).toHaveProperty('filters');
    })