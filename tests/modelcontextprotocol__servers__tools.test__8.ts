it('should calculate sum with zero', async () => {
      const { mockServer, handlers } = createMockServer();
      registerGetSumTool(mockServer);

      const handler = handlers.get('get-sum')!;
      const result = await handler({ a: 0, b: 0 });

      expect(result).toEqual({
        content: [{ type: 'text', text: 'The sum of 0 and 0 is 0.' }],
      });
    })