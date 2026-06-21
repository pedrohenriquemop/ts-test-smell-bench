test('Returns an empty array when there is no registered item', async () => {
        const provider = providerFactory();

        const keys = provider.keys();

        expect(keys).toStrictEqual(expect.any(Array));
        expect(keys).toHaveLength(0);
      })