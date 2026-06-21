it('should create blob resource with correct structure', () => {
      const uri = blobResourceUri(1);
      const resource = blobResource(uri, 1);

      expect(resource.uri).toBe(uri.toString());
      expect(resource.mimeType).toBe('text/plain');
      expect(resource.blob).toBeDefined();
    })