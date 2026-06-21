it('should return error message with high priority', async () => {
      const { mockServer, handlers } = createMockServer();
      registerGetAnnotatedMessageTool(mockServer);

      const handler = handlers.get('get-annotated-message')!;
      const result = await handler({ messageType: 'error', includeImage: false });

      expect(result.content).toHaveLength(1);
      expect(result.content[0].text).toBe('Error: Operation failed');
      expect(result.content[0].annotations).toEqual({
        priority: 1.0,
        audience: ['user', 'assistant'],
      });
    })