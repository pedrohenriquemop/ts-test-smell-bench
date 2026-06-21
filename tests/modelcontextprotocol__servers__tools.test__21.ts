it('should include annotated image when requested', async () => {
      const { mockServer, handlers } = createMockServer();
      registerGetAnnotatedMessageTool(mockServer);

      const handler = handlers.get('get-annotated-message')!;
      const result = await handler({ messageType: 'success', includeImage: true });

      expect(result.content).toHaveLength(2);
      expect(result.content[1].type).toBe('image');
      expect(result.content[1].annotations).toEqual({
        priority: 0.5,
        audience: ['user'],
      });
    })