it('should return specified number of resource links', async () => {
      const { mockServer, handlers } = createMockServer();
      registerGetResourceLinksTool(mockServer);

      const handler = handlers.get('get-resource-links')!;
      const result = await handler({ count: 3 });

      // 1 intro text + 3 resource links
      expect(result.content).toHaveLength(4);
      expect(result.content[0].type).toBe('text');
      expect(result.content[0].text).toContain('3 resource links');

      // Check resource links
      for (let i = 1; i < 4; i++) {
        expect(result.content[i].type).toBe('resource_link');
        expect(result.content[i].uri).toBeDefined();
        expect(result.content[i].name).toBeDefined();
      }
    })