it('should use default count of 3', async () => {
      const { mockServer, handlers } = createMockServer();
      registerGetResourceLinksTool(mockServer);

      const handler = handlers.get('get-resource-links')!;
      const result = await handler({});

      // 1 intro text + 3 resource links (default)
      expect(result.content).toHaveLength(4);
    })