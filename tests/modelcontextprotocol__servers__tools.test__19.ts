it('should return success message with medium priority', async () => {
      const { mockServer, handlers } = createMockServer();
      registerGetAnnotatedMessageTool(mockServer);

      const handler = handlers.get('get-annotated-message')!;
      const result = await handler({ messageType: 'success', includeImage: false });

      expect(result.content[0].text).toBe('Operation completed successfully');
      expect(result.content[0].annotations.priority).toBe(0.7);
      expect(result.content[0].annotations.audience).toEqual(['user']);
    })