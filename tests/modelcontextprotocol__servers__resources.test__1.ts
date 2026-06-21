it('should create URL for text resource', () => {
      const uri = textResourceUri(1);
      expect(uri.toString()).toBe('demo://resource/dynamic/text/1');
    })