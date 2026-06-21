it('should return blob resource reference', () => {
      const { mockServer, handlers } = createMockServer();
      registerEmbeddedResourcePrompt(mockServer);

      const handler = handlers.get('resource-prompt')!;
      const result = handler({ resourceType: 'Blob', resourceId: '5' });

      expect(result.messages[0].content.text).toContain('Blob');
      expect(result.messages[1].content.resource.uri).toContain('blob/5');
    })