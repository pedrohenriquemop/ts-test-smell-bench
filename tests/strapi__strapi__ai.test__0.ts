it('returns a namespace with an admin property', () => {
    const ns = createAiNamespace(createMockStrapi({}));
    expect(ns.admin).toBeDefined();
  })