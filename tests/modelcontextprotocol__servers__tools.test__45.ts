it('should register when client supports roots', () => {
      const handlers: Map<string, Function> = new Map();
      const mockServer = {
        registerTool: vi.fn((name: string, config: any, handler: Function) => {
          handlers.set(name, handler);
        }),
        server: {
          getClientCapabilities: vi.fn(() => ({ roots: {} })),
        },
      } as unknown as McpServer;

      registerGetRootsListTool(mockServer);

      expect(mockServer.registerTool).toHaveBeenCalledWith(
        'get-roots-list',
        expect.objectContaining({
          title: 'Get Roots List Tool',
          description: expect.stringContaining('roots'),
        }),
        expect.any(Function)
      );
    })