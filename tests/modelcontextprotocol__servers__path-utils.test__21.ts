it('should NEVER convert WSL paths - they work correctly in WSL with Node.js fs', () => {
      // The key insight: When running `wsl npx ...`, Node.js runs INSIDE WSL (process.platform === 'linux')
      // and /mnt/c/ paths work correctly with Node.js fs operations in that environment.
      // Converting them to C:\ format breaks fs operations because Windows paths don't work inside WSL.

      // Mock Linux platform (inside WSL)
      Object.defineProperty(process, 'platform', {
        value: 'linux',
        writable: true,
        configurable: true
      });

      // WSL paths should NOT be converted, even inside WSL
      expect(normalizePath('/mnt/c/Users/username/folder'))
        .toBe('/mnt/c/Users/username/folder');

      expect(normalizePath('/mnt/d/Documents/project'))
        .toBe('/mnt/d/Documents/project');
    })