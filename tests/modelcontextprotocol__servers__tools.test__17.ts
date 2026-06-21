it('should return weather for Los Angeles', async () => {
      const { mockServer, handlers } = createMockServer();
      registerGetStructuredContentTool(mockServer);

      const handler = handlers.get('get-structured-content')!;
      const result = await handler({ location: 'Los Angeles' });

      expect(result.structuredContent).toEqual({
        temperature: 73,
        conditions: 'Sunny / Clear',
        humidity: 48,
      });
    })