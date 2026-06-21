it('should handle floating point numbers', async () => {
      const { mockServer, handlers } = createMockServer();
      registerGetSumTool(mockServer);

      const handler = handlers.get('get-sum')!;
      const result = await handler({ a: 1.5, b: 2.5 });

      expect(result).toEqual({
        content: [{ type: 'text', text: 'The sum of 1.5 and 2.5 is 4.' }],
      });
    })