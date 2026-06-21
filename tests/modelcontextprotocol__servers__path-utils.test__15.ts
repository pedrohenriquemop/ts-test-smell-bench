it('capitalizes lowercase drive letters for Windows paths', () => {
      expect(normalizePath('c:/windows/system32'))
        .toBe('C:\\windows\\system32');
      // WSL paths should always be preserved
      expect(normalizePath('/mnt/d/my/folder'))
        .toBe('/mnt/d/my/folder');

      if (process.platform === 'win32') {
        // On Windows, Unix-style paths should be converted and capitalized
        expect(normalizePath('/e/another/folder'))
          .toBe('E:\\another\\folder');
      } else {
        // On Linux, /e/ is just a regular Unix path
        expect(normalizePath('/e/another/folder'))
          .toBe('/e/another/folder');
      }
    })