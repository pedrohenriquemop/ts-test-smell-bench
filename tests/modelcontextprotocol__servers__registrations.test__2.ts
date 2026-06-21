it('should not register conditional tools when capabilities missing', async () => {
      const { registerConditionalTools } = await import('../tools/index.js');

      const mockServerNoCapabilities = {
        registerTool: vi.fn(),
        server: {
          getClientCapabilities: vi.fn(() => ({})),
        },
        experimental: {
          tasks: {
            registerToolTask: vi.fn(),
          },
        },
      } as unknown as McpServer;

      registerConditionalTools(mockServerNoCapabilities);

      // Should not register any capability-gated tools when capabilities are missing
      expect(mockServerNoCapabilities.registerTool).not.toHaveBeenCalled();
    })