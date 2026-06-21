it('rejects empty inputs', () => {
      const allowed = ['/home/user/project'];

      expect(isPathWithinAllowedDirectories('', allowed)).toBe(false);
      expect(isPathWithinAllowedDirectories('/home/user/project', [])).toBe(false);
    })