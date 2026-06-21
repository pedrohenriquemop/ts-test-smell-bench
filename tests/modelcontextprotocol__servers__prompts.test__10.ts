it('should include both intro text and resource messages', () => {
      const { mockServer, handlers } = createMockServer();
      registerEmbeddedResourcePrompt(mockServer);

      const handler = handlers.get('resource-prompt')!;
      const result = handler({ resourceType: 'Text', resourceId: '3' });

      expect(result.messages).toHaveLength(2);
      expect(result.messages[0].role).toBe('user');
      expect(result.messages[0].content.type).toBe('text');
      expect(result.messages[1].role).toBe('user');
      expect(result.messages[1].content.type).toBe('resource');
    })