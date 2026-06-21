it('should register all standard tools', async () => {
      const { registerTools } = await import('../tools/index.js');
      const mockServer = createMockServer();

      registerTools(mockServer);

      // Should register 12 standard tools (non-conditional)
      expect(mockServer.registerTool).toHaveBeenCalledTimes(12);

      // Verify specific tools are registered
      const registeredTools = (mockServer.registerTool as any).mock.calls.map(
        (call: any[]) => call[0]
      );
      expect(registeredTools).toContain('echo');
      expect(registeredTools).toContain('get-sum');
      expect(registeredTools).toContain('get-env');
      expect(registeredTools).toContain('get-tiny-image');
      expect(registeredTools).toContain('get-structured-content');
      expect(registeredTools).toContain('get-annotated-message');
      expect(registeredTools).toContain('trigger-long-running-operation');
      expect(registeredTools).toContain('get-resource-links');
      expect(registeredTools).toContain('get-resource-reference');
      expect(registeredTools).toContain('gzip-file-as-resource');
      expect(registeredTools).toContain('toggle-simulated-logging');
      expect(registeredTools).toContain('toggle-subscriber-updates');
    })