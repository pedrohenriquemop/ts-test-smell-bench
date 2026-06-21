it('should create text resource with correct structure', () => {
      const uri = textResourceUri(1);
      const resource = textResource(uri, 1);

      expect(resource.uri).toBe(uri.toString());
      expect(resource.mimeType).toBe('text/plain');
      expect(resource.text).toContain('Resource 1');
      expect(resource.text).toContain('plaintext');
    })