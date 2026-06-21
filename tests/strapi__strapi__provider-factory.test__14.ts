test('Does nothing when there is no registered item', async () => {
        const provider = providerFactory();

        expect(provider.size()).toBe(0);

        await provider.clear();

        expect(provider.size()).toBe(0);
      })