it('never converts WSL paths (they work correctly in WSL with Node.js fs)', () => {
      // WSL paths should NEVER be converted, regardless of platform
      // They are valid Linux paths that work with Node.js fs operations inside WSL
      expect(convertToWindowsPath('/mnt/c/NS/MyKindleContent'))
        .toBe('/mnt/c/NS/MyKindleContent');
      expect(convertToWindowsPath('/mnt/d/Documents'))
        .toBe('/mnt/d/Documents');
    })