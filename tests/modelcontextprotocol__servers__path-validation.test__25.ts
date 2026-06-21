it('allows percent signs in filenames', () => {
      const allowed = ['/home/user/project'];

      // Percent is a valid filename character
      expect(isPathWithinAllowedDirectories('/home/user/project/report_50%.pdf', allowed)).toBe(true);
      expect(isPathWithinAllowedDirectories('/home/user/project/Q1_25%_growth', allowed)).toBe(true);
      expect(isPathWithinAllowedDirectories('/home/user/project/%41', allowed)).toBe(true); // File named %41

      // URL encoding is NOT decoded by path.normalize, so these are just odd filenames
      expect(isPathWithinAllowedDirectories('/home/user/project/%2e%2e', allowed)).toBe(true); // File named "%2e%2e"
      expect(isPathWithinAllowedDirectories('/home/user/project/file%20name', allowed)).toBe(true); // File with %20 in name
    })