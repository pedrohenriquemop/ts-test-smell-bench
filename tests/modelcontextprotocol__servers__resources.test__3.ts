it('should create URL for blob resource', () => {
      const uri = blobResourceUri(1);
      expect(uri.toString()).toBe('demo://resource/dynamic/blob/1');
    })