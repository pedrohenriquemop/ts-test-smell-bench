it('should reject invalid input', async () => {
      const { mockServer, handlers } = createMockServer();
      registerGetSumTool(mockServer);

      const handler = handlers.get('get-sum')!;

      await expect(handler({})).rejects.toThrow();
      await expect(handler({ a: 'not a number', b: 5 })).rejects.toThrow();
      await expect(handler({ a: 5 })).rejects.toThrow();
    })