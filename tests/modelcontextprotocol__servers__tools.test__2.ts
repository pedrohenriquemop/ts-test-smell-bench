it('should reject invalid input', async () => {
      const { mockServer, handlers } = createMockServer();
      registerEchoTool(mockServer);

      const handler = handlers.get('echo')!;

      await expect(handler({})).rejects.toThrow();
      await expect(handler({ message: 123 })).rejects.toThrow();
    })