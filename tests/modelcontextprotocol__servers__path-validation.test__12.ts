it('returns false for relative paths in allowed directories', () => {
      const badAllowed = ['relative/path', '/some/other/absolute/path'];

      // Relative paths in allowed dirs are normalized to absolute based on cwd
      // The normalized 'relative/path' won't match our test path
      expect(isPathWithinAllowedDirectories('/some/other/absolute/path/file', badAllowed)).toBe(true);
      expect(isPathWithinAllowedDirectories('/absolute/path/file', badAllowed)).toBe(false);
    })