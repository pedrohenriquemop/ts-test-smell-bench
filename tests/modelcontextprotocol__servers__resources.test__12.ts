it('should validate string IDs', () => {
      // Test that valid strings pass validation
      expect(() => (resourceIdForPromptCompleter as any).parse('1')).not.toThrow();
      expect(() => (resourceIdForPromptCompleter as any).parse('100')).not.toThrow();
    })