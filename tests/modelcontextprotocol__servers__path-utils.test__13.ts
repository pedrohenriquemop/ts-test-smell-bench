it('preserves spaces in all path formats', () => {
      // WSL paths should always be preserved
      expect(normalizePath('/mnt/c/Program Files/App Name'))
        .toBe('/mnt/c/Program Files/App Name');

      if (process.platform === 'win32') {
        // On Windows, Unix-style paths like /c/ should be converted
        expect(normalizePath('/c/Program Files/App Name'))
          .toBe('C:\\Program Files\\App Name');
      } else {
        // On Linux, /c/ is just a regular Unix path
        expect(normalizePath('/c/Program Files/App Name'))
          .toBe('/c/Program Files/App Name');
      }
      expect(normalizePath('C:/Program Files/App Name'))
        .toBe('C:\\Program Files\\App Name');
    })