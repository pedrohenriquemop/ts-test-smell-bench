it('handles trailing separators correctly', () => {
      const allowed = ['/home/user/project'];

      // Path with trailing separator should still match
      expect(isPathWithinAllowedDirectories('/home/user/project/', allowed)).toBe(true);

      // Allowed directory with trailing separator
      const allowedWithSep = ['/home/user/project/'];
      expect(isPathWithinAllowedDirectories('/home/user/project', allowedWithSep)).toBe(true);
      expect(isPathWithinAllowedDirectories('/home/user/project/', allowedWithSep)).toBe(true);

      // Should still block similar names with or without trailing separators
      expect(isPathWithinAllowedDirectories('/home/user/project2', allowedWithSep)).toBe(false);
      expect(isPathWithinAllowedDirectories('/home/user/project2', allowed)).toBe(false);
      expect(isPathWithinAllowedDirectories('/home/user/project2/', allowed)).toBe(false);
    })