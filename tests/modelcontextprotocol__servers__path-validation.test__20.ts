it('blocks path traversal attempts', () => {
      const allowed = ['/home/user/project'];

      // Basic traversal attempts
      expect(isPathWithinAllowedDirectories('/home/user/project/../../../etc/passwd', allowed)).toBe(false);
      expect(isPathWithinAllowedDirectories('/home/user/project/../../other', allowed)).toBe(false);
      expect(isPathWithinAllowedDirectories('/home/user/project/../project2', allowed)).toBe(false);

      // Mixed traversal with valid segments
      expect(isPathWithinAllowedDirectories('/home/user/project/src/../../project2', allowed)).toBe(false);
      expect(isPathWithinAllowedDirectories('/home/user/project/./../../other', allowed)).toBe(false);

      // Multiple traversal sequences
      expect(isPathWithinAllowedDirectories('/home/user/project/../project/../../../etc', allowed)).toBe(false);
    })