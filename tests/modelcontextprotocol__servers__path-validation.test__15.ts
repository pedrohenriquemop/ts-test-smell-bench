it('handles paths with spaces correctly', () => {
      const allowed = ['/home/user/my project'];

      expect(isPathWithinAllowedDirectories('/home/user/my project', allowed)).toBe(true);
      expect(isPathWithinAllowedDirectories('/home/user/my project/file', allowed)).toBe(true);

      // Partial matches should fail
      expect(isPathWithinAllowedDirectories('/home/user/my', allowed)).toBe(false);
      expect(isPathWithinAllowedDirectories('/home/user/my proj', allowed)).toBe(false);
    })