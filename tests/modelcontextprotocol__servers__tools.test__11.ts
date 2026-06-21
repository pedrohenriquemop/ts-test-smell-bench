it('should return all environment variables as JSON', async () => {
      const { mockServer, handlers } = createMockServer();
      registerGetEnvTool(mockServer);

      const handler = handlers.get('get-env')!;
      process.env.TEST_VAR_EVERYTHING = 'test_value';
      const result = await handler({});

      expect(result.content).toHaveLength(1);
      expect(result.content[0].type).toBe('text');

      const envJson = JSON.parse(result.content[0].text);
      expect(envJson.TEST_VAR_EVERYTHING).toBe('test_value');

      delete process.env.TEST_VAR_EVERYTHING;
    })