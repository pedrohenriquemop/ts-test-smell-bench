it('should NOT convert Unix-style paths (/c/) when running inside WSL (linux)', () => {
      // Mock process.platform to be 'linux' (WSL/Linux)
      Object.defineProperty(process, 'platform', {
        value: 'linux',
        writable: true,
        configurable: true
      });

      // When on Linux, /c/ is just a regular Unix directory, not a drive letter
      expect(normalizePath('/c/some/path'))
        .toBe('/c/some/path');

      expect(normalizePath('/d/another/path'))
        .toBe('/d/another/path');
    })