it('should handle empty message', async () => {
      const { mockServer, handlers } = createMockServer();
      registerEchoTool(mockServer);

      const handler = handlers.get('echo')!;
      const result = await handler({ message: '' });

      expect(result).toEqual({
        content: [{ type: 'text', text: 'Echo: ' }],
      });
    })