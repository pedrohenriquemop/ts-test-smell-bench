test('Returns every registered item (only the value, not the key)', async () => {
        const provider = providerFactory();
        const items = [
          { key: 'keyA', value: { foo: 'barA', bar: 'foo1' } },
          { key: 'keyB', value: { foo: 'barB', bar: 'foo2' } },
          { key: 'keyC', value: { foo: 'barC', bar: 'foo1' } },
          { key: 'keyD', value: { foo: 'barD', bar: 'foo2' } },
        ];

        for (const item of items) {
          await provider.register(item.key, item.value);
        }

        const values = provider.values();

        expect(values).toStrictEqual(items.map((item) => item.value));
      })