it('converts Unix-style Windows paths only on Windows platform', () => {
      // On Windows, /c/ style paths should be converted
      if (process.platform === 'win32') {
        expect(convertToWindowsPath('/c/NS/MyKindleContent'))
          .toBe('C:\\NS\\MyKindleContent');
      } else {
        // On Linux, leave them unchanged
        expect(convertToWindowsPath('/c/NS/MyKindleContent'))
          .toBe('/c/NS/MyKindleContent');
      }
    })