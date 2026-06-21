it('should register when client supports sampling', () => {
      const handlers: Map<string, Function> = new Map();
      const mockServer = {
        registerTool: vi.fn((name: string, config: any, handler: Function) => {
          handlers.set(name, handler);
        }),
        server: {
          getClientCapabilities: vi.fn(() => ({ sampling: {} })),
        },
      } as unknown as McpServer;

      registerTriggerSamplingRequestTool(mockServer);

      expect(mockServer.registerTool).toHaveBeenCalledWith(
        'trigger-sampling-request',
        expect.objectContaining({
          title: 'Trigger Sampling Request Tool',
          description: expect.stringContaining('Sampling'),
        }),
        expect.any(Function)
      );
    })