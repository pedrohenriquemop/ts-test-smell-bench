it('normalizes relative paths to absolute', () => {
      const allowed = [process.cwd()];

      // Relative paths get normalized to absolute paths based on cwd
      expect(isPathWithinAllowedDirectories('relative/path', allowed)).toBe(true);
      expect(isPathWithinAllowedDirectories('./file', allowed)).toBe(true);

      // Parent directory references that escape allowed directory
      const parentAllowed = ['/home/user/project'];
      expect(isPathWithinAllowedDirectories('../parent', parentAllowed)).toBe(false);
    })