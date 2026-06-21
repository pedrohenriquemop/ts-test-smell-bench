it('should be defined as a completable schema', () => {
      // The completer is a zod schema wrapped with completable
      expect(resourceTypeCompleter).toBeDefined();
      // It should have the zod parse method
      expect(typeof (resourceTypeCompleter as any).parse).toBe('function');
    })