it('should send progress notifications when progressToken provided', async () => {
      const { mockServer, handlers } = createMockServer();
      registerTriggerLongRunningOperationTool(mockServer);

      const handler = handlers.get('trigger-long-running-operation')!;
      await handler(
        { duration: 0.1, steps: 2 },
        { _meta: { progressToken: 'token-123' }, requestId: 'test-456', sessionId: 'session-1' }
      );

      expect(mockServer.server.notification).toHaveBeenCalledTimes(2);
      expect(mockServer.server.notification).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'notifications/progress',
          params: expect.objectContaining({
            progressToken: 'token-123',
          }),
        }),
        expect.any(Object)
      );
    }, 10000)