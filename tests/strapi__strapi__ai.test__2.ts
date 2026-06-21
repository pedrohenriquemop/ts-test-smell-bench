it('calls get() on each access (no stale cache)', () => {
      const mockStrapi = createMockStrapi({});
      const ns = createAiNamespace(mockStrapi);

      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      ns.admin;
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      ns.admin;

      expect(mockStrapi.get).toHaveBeenCalledTimes(2);
    })