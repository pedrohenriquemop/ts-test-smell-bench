it('should echo back the message', async () => {
      const { mockServer, handlers } = createMockServer();
      registerEchoTool(mockServer);

      const handler = handlers.get('echo')!;
      const result = await handler({ message: 'Hello, World!' });

      expect(result).toEqual({
        content: [{ type: 'text', text: 'Echo: Hello, World!' }],
      });
    })