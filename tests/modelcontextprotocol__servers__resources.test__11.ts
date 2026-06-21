it('should be defined as a completable schema', () => {
      expect(resourceIdForPromptCompleter).toBeDefined();
      expect(typeof (resourceIdForPromptCompleter as any).parse).toBe('function');
    })