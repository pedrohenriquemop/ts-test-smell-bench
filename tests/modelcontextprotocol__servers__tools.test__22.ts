it('should complete operation and return result', async () => {
      const { mockServer, handlers } = createMockServer();
      registerTriggerLongRunningOperationTool(mockServer);

      const handler = handlers.get('trigger-long-running-operation')!;
      // Use very short duration for test
      const result = await handler(
        { duration: 0.1, steps: 2 },
        { _meta: {}, requestId: 'test-123' }
      );

      expect(result.content[0].text).toContain('Long running operation completed');
      expect(result.content[0].text).toContain('Duration: 0.1 seconds');
      expect(result.content[0].text).toContain('Steps: 2');
    }, 10000)