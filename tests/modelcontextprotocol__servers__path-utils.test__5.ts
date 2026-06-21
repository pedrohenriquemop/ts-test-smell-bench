it('handles drive letter paths based on platform', () => {
      // WSL paths should never be converted
      expect(convertToWindowsPath('/mnt/d/some/path'))
        .toBe('/mnt/d/some/path');

      if (process.platform === 'win32') {
        // On Windows, Unix-style paths like /d/ should be converted
        expect(convertToWindowsPath('/d/some/path'))
          .toBe('D:\\some\\path');
      } else {
        // On Linux, /d/ is just a regular Unix path
        expect(convertToWindowsPath('/d/some/path'))
          .toBe('/d/some/path');
      }
    })