it('should return valid JSON', async () => {
      const { mockServer, handlers } = createMockServer();
      registerGetEnvTool(mockServer);

      const handler = handlers.get('get-env')!;
      const result = await handler({});

      expect(() => JSON.parse(result.content[0].text)).not.toThrow();
    })