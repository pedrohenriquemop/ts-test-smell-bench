it('handles symbolic dots in filenames', () => {
      const allowed = ['/home/user/project'];

      // Single and double dots as actual filenames (not traversal)
      expect(isPathWithinAllowedDirectories('/home/user/project/.', allowed)).toBe(true);
      expect(isPathWithinAllowedDirectories('/home/user/project/..', allowed)).toBe(false); // This normalizes to parent
      expect(isPathWithinAllowedDirectories('/home/user/project/...', allowed)).toBe(true); // Three dots is a valid filename
      expect(isPathWithinAllowedDirectories('/home/user/project/....', allowed)).toBe(true); // Four dots is a valid filename
    })