it('should return weather for Chicago', async () => {
      const { mockServer, handlers } = createMockServer();
      registerGetStructuredContentTool(mockServer);

      const handler = handlers.get('get-structured-content')!;
      const result = await handler({ location: 'Chicago' });

      expect(result.structuredContent).toEqual({
        temperature: 36,
        conditions: 'Light rain / drizzle',
        humidity: 82,
      });
    })