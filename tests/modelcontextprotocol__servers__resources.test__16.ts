it('should generate correct URI for resource name', () => {
      expect(getSessionResourceURI('test')).toBe('demo://resource/session/test');
    })