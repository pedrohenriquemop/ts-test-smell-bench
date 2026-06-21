it('should handle undefined sessionId', async () => {
      const { mockServer, handlers } = createMockServer();
      registerToggleSimulatedLoggingTool(mockServer);

      const handler = handlers.get('toggle-simulated-logging')!;
      const result = await handler({}, {});

      expect(result.content[0].text).toContain('Started');
    })