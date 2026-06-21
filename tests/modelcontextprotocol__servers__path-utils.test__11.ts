it('handles Unix-style Windows paths', () => {
      // On Windows, /c/ paths should be converted
      if (process.platform === 'win32') {
        expect(normalizePath('/c/NS/MyKindleContent'))
          .toBe('C:\\NS\\MyKindleContent');
      } else if (process.platform === 'linux') {
        // On Linux, /c/ is just a regular Unix path
        expect(normalizePath('/c/NS/MyKindleContent'))
          .toBe('/c/NS/MyKindleContent');
      }
    })