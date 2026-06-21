it('should return blob resource reference', async () => {
      const { mockServer, handlers } = createMockServer();
      registerGetResourceReferenceTool(mockServer);

      const handler = handlers.get('get-resource-reference')!;
      const result = await handler({ resourceType: 'Blob', resourceId: 5 });

      expect(result.content[1].resource.uri).toContain('blob/5');
    })