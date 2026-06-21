it('should reject invalid resource ID', () => {
      const { mockServer, handlers } = createMockServer();
      registerEmbeddedResourcePrompt(mockServer);

      const handler = handlers.get('resource-prompt')!;
      expect(() => handler({ resourceType: 'Text', resourceId: '-1' })).toThrow(
        'Invalid resourceId'
      );
      expect(() => handler({ resourceType: 'Text', resourceId: '0' })).toThrow(
        'Invalid resourceId'
      );
      expect(() => handler({ resourceType: 'Text', resourceId: 'abc' })).toThrow(
        'Invalid resourceId'
      );
    })