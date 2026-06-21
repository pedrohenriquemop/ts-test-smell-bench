it('should register resource templates', async () => {
      const { registerResources } = await import('../resources/index.js');
      const mockServer = createMockServer();

      registerResources(mockServer);

      // Should register at least the 2 resource templates (text and blob) plus file resources
      expect(mockServer.registerResource).toHaveBeenCalled();
      const registeredResources = (mockServer.registerResource as any).mock.calls.map(
        (call: any[]) => call[0]
      );
      expect(registeredResources).toContain('Dynamic Text Resource');
      expect(registeredResources).toContain('Dynamic Blob Resource');
    })