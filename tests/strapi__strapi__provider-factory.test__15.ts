test('Delete every registered item', async () => {
        const provider = providerFactory();
        const items = [
          { key: 'keyA', value: { foo: 'barA' } },
          { key: 'keyB', value: { foo: 'barB' } },
          { key: 'keyC', value: { foo: 'barC' } },
        ];

        for (const item of items) {
          await provider.register(item.key, item.value);
        }

        expect(provider.size()).toBe(items.length);

        await provider.clear();

        expect(provider.size()).toBe(0);
      })