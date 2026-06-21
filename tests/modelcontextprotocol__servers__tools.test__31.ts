it('should start logging when not active', async () => {
      const { mockServer, handlers } = createMockServer();
      registerToggleSimulatedLoggingTool(mockServer);

      const handler = handlers.get('toggle-simulated-logging')!;
      const result = await handler({}, { sessionId: 'test-session-1' });

      expect(result.content[0].text).toContain('Started');
      expect(result.content[0].text).toContain('test-session-1');
    })