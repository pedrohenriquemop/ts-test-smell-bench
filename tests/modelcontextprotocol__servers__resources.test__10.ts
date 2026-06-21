it('should validate string resource types', () => {
      // Test that valid strings pass validation
      expect(() => (resourceTypeCompleter as any).parse('Text')).not.toThrow();
      expect(() => (resourceTypeCompleter as any).parse('Blob')).not.toThrow();
    })