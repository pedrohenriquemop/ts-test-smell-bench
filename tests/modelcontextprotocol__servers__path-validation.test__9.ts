it('skips empty directory entries in allowed list', () => {
      const allowed = ['', '/home/user/project', ''];
      expect(isPathWithinAllowedDirectories('/home/user/project', allowed)).toBe(true);
      expect(isPathWithinAllowedDirectories('/home/user/project/src', allowed)).toBe(true);

      // Should still validate properly with empty entries
      expect(isPathWithinAllowedDirectories('/home/user/other', allowed)).toBe(false);
    })