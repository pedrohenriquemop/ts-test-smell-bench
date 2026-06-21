it('should handle different resource IDs', () => {
      expect(textResourceUri(5).toString()).toBe('demo://resource/dynamic/text/5');
      expect(textResourceUri(100).toString()).toBe('demo://resource/dynamic/text/100');
    })