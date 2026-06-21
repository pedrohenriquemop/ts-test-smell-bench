it('should convert Unix-style Windows paths (/c/) only when running on Windows (win32)', () => {
      // Mock process.platform to be 'win32' (Windows)
      Object.defineProperty(process, 'platform', {
        value: 'win32',
        writable: true,
        configurable: true
      });

      // Unix-style Windows paths like /c/ should be converted on Windows
      expect(normalizePath('/c/Users/username/folder'))
        .toBe('C:\\Users\\username\\folder');

      expect(normalizePath('/d/Documents/project'))
        .toBe('D:\\Documents\\project');
    })