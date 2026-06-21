it('should stop logging when already active', async () => {
      const { mockServer, handlers } = createMockServer();
      registerToggleSimulatedLoggingTool(mockServer);

      const handler = handlers.get('toggle-simulated-logging')!;

      // First call starts logging
      await handler({}, { sessionId: 'test-session-2' });

      // Second call stops logging
      const result = await handler({}, { sessionId: 'test-session-2' });

      expect(result.content[0].text).toContain('Stopped');
      expect(result.content[0].text).toContain('test-session-2');
    })