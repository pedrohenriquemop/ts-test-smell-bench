it('handles unicode characters in paths', () => {
      const allowed = ['/home/user/café'];

      expect(isPathWithinAllowedDirectories('/home/user/café', allowed)).toBe(true);
      expect(isPathWithinAllowedDirectories('/home/user/café/file', allowed)).toBe(true);

      // Different unicode representation won't match (not normalized)
      const decomposed = '/home/user/cafe\u0301'; // e + combining accent
      expect(isPathWithinAllowedDirectories(decomposed, allowed)).toBe(false);
    })