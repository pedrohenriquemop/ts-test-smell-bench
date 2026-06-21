it('should start and stop updates without errors', () => {
      const mockServer = {
        server: {
          notification: vi.fn(),
        },
      } as unknown as McpServer;

      // Start updates - should work for both defined and undefined sessionId
      beginSimulatedResourceUpdates(mockServer, 'lifecycle-test-session');
      beginSimulatedResourceUpdates(mockServer, undefined);

      // Stop updates - should handle all cases gracefully
      stopSimulatedResourceUpdates('lifecycle-test-session');
      stopSimulatedResourceUpdates('non-existent-session');
      stopSimulatedResourceUpdates(undefined);

      // If we got here without throwing, the lifecycle works correctly
      expect(true).toBe(true);
    })