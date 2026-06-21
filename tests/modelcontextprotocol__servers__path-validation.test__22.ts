it('handles complex traversal patterns', () => {
      const allowed = ['/home/user/project'];

      // Double dots in filenames (not traversal) - these normalize to paths within allowed dir
      expect(isPathWithinAllowedDirectories('/home/user/project/..test', allowed)).toBe(true); // Not traversal
      expect(isPathWithinAllowedDirectories('/home/user/project/test..', allowed)).toBe(true); // Not traversal
      expect(isPathWithinAllowedDirectories('/home/user/project/te..st', allowed)).toBe(true); // Not traversal

      // Actual traversal
      expect(isPathWithinAllowedDirectories('/home/user/project/../test', allowed)).toBe(false); // Is traversal - goes to /home/user/test

      // Edge case: /home/user/project/.. normalizes to /home/user (parent dir)
      expect(isPathWithinAllowedDirectories('/home/user/project/..', allowed)).toBe(false); // Goes to parent
    })