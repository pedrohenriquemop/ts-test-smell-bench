it('should reject invalid resource type', () => {
      const { mockServer, handlers } = createMockServer();
      registerEmbeddedResourcePrompt(mockServer);

      const handler = handlers.get('resource-prompt')!;
      expect(() => handler({ resourceType: 'Invalid', resourceId: '1' })).toThrow(
        'Invalid resourceType'
      );
    })