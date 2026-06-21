it('should create valid base64 encoded content', () => {
      const uri = blobResourceUri(3);
      const resource = blobResource(uri, 3);

      // Decode and verify content
      const decoded = Buffer.from(resource.blob, 'base64').toString();
      expect(decoded).toContain('Resource 3');
      expect(decoded).toContain('base64 blob');
    })