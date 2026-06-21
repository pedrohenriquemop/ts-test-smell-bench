it('should return weather for New York', async () => {
      const { mockServer, handlers } = createMockServer();
      registerGetStructuredContentTool(mockServer);

      const handler = handlers.get('get-structured-content')!;
      const result = await handler({ location: 'New York' });

      expect(result.structuredContent).toEqual({
        temperature: 33,
        conditions: 'Cloudy',
        humidity: 82,
      });
      expect(result.content[0].type).toBe('text');
      expect(JSON.parse(result.content[0].text)).toEqual(result.structuredContent);
    })