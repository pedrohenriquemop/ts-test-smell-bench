it('should return text resource reference', async () => {
      const { mockServer, handlers } = createMockServer();
      registerGetResourceReferenceTool(mockServer);

      const handler = handlers.get('get-resource-reference')!;
      const result = await handler({ resourceType: 'Text', resourceId: 1 });

      expect(result.content).toHaveLength(3);
      expect(result.content[0].text).toContain('Resource 1');
      expect(result.content[1].type).toBe('resource');
      expect(result.content[1].resource.uri).toContain('text/1');
      expect(result.content[2].text).toContain('URI');
    })