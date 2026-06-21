it('should handle different resource IDs', () => {
      expect(blobResourceUri(5).toString()).toBe('demo://resource/dynamic/blob/5');
      expect(blobResourceUri(100).toString()).toBe('demo://resource/dynamic/blob/100');
    })