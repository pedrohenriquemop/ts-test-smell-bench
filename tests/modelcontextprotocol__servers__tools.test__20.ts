it('should return debug message with low priority', async () => {
      const { mockServer, handlers } = createMockServer();
      registerGetAnnotatedMessageTool(mockServer);

      const handler = handlers.get('get-annotated-message')!;
      const result = await handler({ messageType: 'debug', includeImage: false });

      expect(result.content[0].text).toContain('Debug:');
      expect(result.content[0].annotations.priority).toBe(0.3);
      expect(result.content[0].annotations.audience).toEqual(['assistant']);
    })