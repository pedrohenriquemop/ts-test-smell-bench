it('removes invalid nested scalar filter keys next to operators', async () => {
    const query = {
      filters: {
        title: {
          $containsi: 'foo',
          __invalidNestedFilterKey: 'should-be-removed',
        },
      },
    };

    const result = await sanitizers.query(query, schema);

    expect(result).toMatchObject({
      filters: {
        title: {
          $containsi: 'foo',
        },
      },
    });
    expect((result as any).filters.title).not.toHaveProperty('__invalidNestedFilterKey');
  })