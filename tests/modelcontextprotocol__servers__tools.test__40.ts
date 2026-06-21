it('should register when client supports elicitation', () => {
      const handlers: Map<string, Function> = new Map();
      const mockServer = {
        registerTool: vi.fn((name: string, config: any, handler: Function) => {
          handlers.set(name, handler);
        }),
        server: {
          getClientCapabilities: vi.fn(() => ({ elicitation: {} })),
        },
      } as unknown as McpServer;

      registerTriggerElicitationRequestTool(mockServer);

      expect(mockServer.registerTool).toHaveBeenCalledWith(
        'trigger-elicitation-request',
        expect.objectContaining({
          title: 'Trigger Elicitation Request Tool',
          description: expect.stringContaining('Elicitation'),
        }),
        expect.any(Function)
      );
    })