it('should register conditional tools based on capabilities', async () => {
      const { registerConditionalTools } = await import('../tools/index.js');

      // Server with all capabilities including experimental tasks API
      const mockServerWithCapabilities = {
        registerTool: vi.fn(),
        server: {
          getClientCapabilities: vi.fn(() => ({
            roots: {},
            elicitation: {},
            sampling: {},
          })),
        },
        experimental: {
          tasks: {
            registerToolTask: vi.fn(),
          },
        },
      } as unknown as McpServer;

      registerConditionalTools(mockServerWithCapabilities);

      // Should register 3 conditional tools + 3 task-based tools when all capabilities present
      expect(mockServerWithCapabilities.registerTool).toHaveBeenCalledTimes(3);

      const registeredTools = (
        mockServerWithCapabilities.registerTool as any
      ).mock.calls.map((call: any[]) => call[0]);
      expect(registeredTools).toContain('get-roots-list');
      expect(registeredTools).toContain('trigger-elicitation-request');
      expect(registeredTools).toContain('trigger-sampling-request');

      // Task-based tools are registered via experimental.tasks.registerToolTask
      expect(mockServerWithCapabilities.experimental.tasks.registerToolTask).toHaveBeenCalled();
    })