it('should set request handlers on server', () => {
      const mockServer = {
        server: {
          setRequestHandler: vi.fn(),
        },
        sendLoggingMessage: vi.fn(),
      } as unknown as McpServer;

      setSubscriptionHandlers(mockServer);

      // Should set both subscribe and unsubscribe handlers
      expect(mockServer.server.setRequestHandler).toHaveBeenCalledTimes(2);
    })