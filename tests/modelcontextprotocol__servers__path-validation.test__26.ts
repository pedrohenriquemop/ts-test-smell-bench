it('handles percent signs in allowed directories', () => {
      const allowed = ['/home/user/project%20files'];

      // This is a directory literally named "project%20files"
      expect(isPathWithinAllowedDirectories('/home/user/project%20files/test', allowed)).toBe(true);
      expect(isPathWithinAllowedDirectories('/home/user/project files/test', allowed)).toBe(false); // Different dir
    })