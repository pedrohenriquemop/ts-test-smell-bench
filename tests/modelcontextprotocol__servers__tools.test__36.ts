it('should not register when client does not support sampling', () => {
      const { mockServer } = createMockServer();
      registerTriggerSamplingRequestTool(mockServer);

      // Tool should not be registered since mock server returns empty capabilities
      expect(mockServer.registerTool).not.toHaveBeenCalled();
    })