test('Can create a default provider', () => {
      const provider = providerFactory();

      expect(provider).toHaveProperty('hooks', expect.any(Object));

      providerMethods.forEach((methodName) =>
        expect(provider).toHaveProperty(methodName, expect.any(Function))
      );
    })