test('Returns an empty array when there is no registered item', async () => {
        const provider = providerFactory();

        const values = provider.values();

        expect(values).toStrictEqual(expect.any(Array));
        expect(values).toHaveLength(0);
      })