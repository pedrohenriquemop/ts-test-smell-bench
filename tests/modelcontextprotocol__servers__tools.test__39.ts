it('should not register when client does not support elicitation', () => {
      const { mockServer } = createMockServer();
      registerTriggerElicitationRequestTool(mockServer);

      expect(mockServer.registerTool).not.toHaveBeenCalled();
    })