it('should handle various resource names', () => {
      expect(getSessionResourceURI('my-file')).toBe('demo://resource/session/my-file');
      expect(getSessionResourceURI('document_123')).toBe(
        'demo://resource/session/document_123'
      );
    })