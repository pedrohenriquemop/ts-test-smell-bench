it('should reject invalid resource ID', async () => {
      const { mockServer, handlers } = createMockServer();
      registerGetResourceReferenceTool(mockServer);

      const handler = handlers.get('get-resource-reference')!;
      await expect(handler({ resourceType: 'Text', resourceId: -1 })).rejects.toThrow(
        'Invalid resourceId'
      );
      await expect(handler({ resourceType: 'Text', resourceId: 0 })).rejects.toThrow(
        'Invalid resourceId'
      );
      await expect(handler({ resourceType: 'Text', resourceId: 1.5 })).rejects.toThrow(
        'Invalid resourceId'
      );
    })