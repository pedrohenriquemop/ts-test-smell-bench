it('should alternate between text and blob resources', async () => {
      const { mockServer, handlers } = createMockServer();
      registerGetResourceLinksTool(mockServer);

      const handler = handlers.get('get-resource-links')!;
      const result = await handler({ count: 4 });

      // Odd IDs (1, 3) are blob, even IDs (2, 4) are text
      expect(result.content[1].name).toContain('Blob');
      expect(result.content[2].name).toContain('Text');
      expect(result.content[3].name).toContain('Blob');
      expect(result.content[4].name).toContain('Text');
    })