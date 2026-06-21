it('should stop updates when already active', async () => {
      const { mockServer, handlers } = createMockServer();
      registerToggleSubscriberUpdatesTool(mockServer);

      const handler = handlers.get('toggle-subscriber-updates')!;

      // First call starts updates
      await handler({}, { sessionId: 'sub-session-2' });

      // Second call stops updates
      const result = await handler({}, { sessionId: 'sub-session-2' });

      expect(result.content[0].text).toContain('Stopped');
      expect(result.content[0].text).toContain('sub-session-2');
    })