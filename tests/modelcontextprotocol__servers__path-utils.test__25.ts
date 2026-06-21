it('should preserve regular Unix paths on all platforms', () => {
      // Test on Linux
      Object.defineProperty(process, 'platform', {
        value: 'linux',
        writable: true,
        configurable: true
      });

      expect(normalizePath('/home/user/documents'))
        .toBe('/home/user/documents');

      expect(normalizePath('/var/log/app'))
        .toBe('/var/log/app');

      // Test on Windows (though these paths wouldn't work on Windows)
      Object.defineProperty(process, 'platform', {
        value: 'win32',
        writable: true,
        configurable: true
      });

      expect(normalizePath('/home/user/documents'))
        .toBe('/home/user/documents');

      expect(normalizePath('/var/log/app'))
        .toBe('/var/log/app');
    })