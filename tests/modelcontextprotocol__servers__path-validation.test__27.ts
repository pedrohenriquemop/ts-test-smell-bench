it('normalizes paths before comparison', () => {
      const allowed = ['/home/user/project'];

      // Trailing slashes
      expect(isPathWithinAllowedDirectories('/home/user/project/', allowed)).toBe(true);
      expect(isPathWithinAllowedDirectories('/home/user/project//', allowed)).toBe(true);
      expect(isPathWithinAllowedDirectories('/home/user/project///', allowed)).toBe(true);

      // Current directory references
      expect(isPathWithinAllowedDirectories('/home/user/project/./src', allowed)).toBe(true);
      expect(isPathWithinAllowedDirectories('/home/user/./project/src', allowed)).toBe(true);

      // Multiple slashes
      expect(isPathWithinAllowedDirectories('/home/user/project//src//file', allowed)).toBe(true);
      expect(isPathWithinAllowedDirectories('/home//user//project//src', allowed)).toBe(true);

      // Should still block outside paths
      expect(isPathWithinAllowedDirectories('/home/user//project2', allowed)).toBe(false);
    })