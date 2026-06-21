it('should register all prompts', async () => {
      const { registerPrompts } = await import('../prompts/index.js');
      const mockServer = createMockServer();

      registerPrompts(mockServer);

      // Should register 4 prompts
      expect(mockServer.registerPrompt).toHaveBeenCalledTimes(4);

      const registeredPrompts = (mockServer.registerPrompt as any).mock.calls.map(
        (call: any[]) => call[0]
      );
      expect(registeredPrompts).toContain('simple-prompt');
      expect(registeredPrompts).toContain('args-prompt');
      expect(registeredPrompts).toContain('completable-prompt');
      expect(registeredPrompts).toContain('resource-prompt');
    })