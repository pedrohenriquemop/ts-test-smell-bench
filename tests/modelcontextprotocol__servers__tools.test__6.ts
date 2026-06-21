it('should calculate sum of two positive numbers', async () => {
      const { mockServer, handlers } = createMockServer();
      registerGetSumTool(mockServer);

      const handler = handlers.get('get-sum')!;
      const result = await handler({ a: 5, b: 3 });

      expect(result).toEqual({
        content: [{ type: 'text', text: 'The sum of 5 and 3 is 8.' }],
      });
    })