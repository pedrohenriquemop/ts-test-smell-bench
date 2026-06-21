it('should return text resource reference', () => {
      const { mockServer, handlers } = createMockServer();
      registerEmbeddedResourcePrompt(mockServer);

      const handler = handlers.get('resource-prompt')!;
      const result = handler({ resourceType: 'Text', resourceId: '1' });

      expect(result.messages).toHaveLength(2);
      expect(result.messages[0].content.text).toContain('Text');
      expect(result.messages[0].content.text).toContain('1');
      expect(result.messages[1].content.type).toBe('resource');
      expect(result.messages[1].content.resource.uri).toContain('text/1');
    })