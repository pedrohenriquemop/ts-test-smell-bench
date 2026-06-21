it('handles nested allowed directories correctly', () => {
      const allowed = ['/home', '/home/user', '/home/user/project'];

      // All paths under /home are allowed
      expect(isPathWithinAllowedDirectories('/home/anything', allowed)).toBe(true);
      expect(isPathWithinAllowedDirectories('/home/user/anything', allowed)).toBe(true);
      expect(isPathWithinAllowedDirectories('/home/user/project/anything', allowed)).toBe(true);

      // First match wins (most permissive)
      expect(isPathWithinAllowedDirectories('/home/other/deep/path', allowed)).toBe(true);
    })