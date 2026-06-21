it('should reject invalid resource type', async () => {
      const { mockServer, handlers } = createMockServer();
      registerGetResourceReferenceTool(mockServer);

      const handler = handlers.get('get-resource-reference')!;
      await expect(handler({ resourceType: 'Invalid', resourceId: 1 })).rejects.toThrow(
        'Invalid resourceType'
      );
    })