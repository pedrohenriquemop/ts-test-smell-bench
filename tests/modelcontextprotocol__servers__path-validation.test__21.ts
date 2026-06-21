it('blocks traversal in allowed directories', () => {
      const allowed = ['/home/user/project/../safe'];

      // The allowed directory itself should be normalized and safe
      expect(isPathWithinAllowedDirectories('/home/user/safe/file', allowed)).toBe(true);
      expect(isPathWithinAllowedDirectories('/home/user/project/file', allowed)).toBe(false);
    })