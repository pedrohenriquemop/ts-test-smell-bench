it('should also preserve WSL paths when running on Windows', () => {
      // Mock Windows platform
      Object.defineProperty(process, 'platform', {
        value: 'win32',
        writable: true,
        configurable: true
      });

      // WSL paths should still be preserved (though they wouldn't be accessible from Windows Node.js)
      expect(normalizePath('/mnt/c/Users/username/folder'))
        .toBe('/mnt/c/Users/username/folder');

      expect(normalizePath('/mnt/d/Documents/project'))
        .toBe('/mnt/d/Documents/project');
    })