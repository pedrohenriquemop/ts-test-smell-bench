it('should start updates when not active', async () => {
      const { mockServer, handlers } = createMockServer();
      registerToggleSubscriberUpdatesTool(mockServer);

      const handler = handlers.get('toggle-subscriber-updates')!;
      const result = await handler({}, { sessionId: 'sub-session-1' });

      expect(result.content[0].text).toContain('Started');
      expect(result.content[0].text).toContain('sub-session-1');
    })