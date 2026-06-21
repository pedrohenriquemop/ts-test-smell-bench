it('rejects allowed directories with null bytes', () => {
      const allowed = ['/home/user/project\x00'];

      expect(isPathWithinAllowedDirectories('/home/user/project', allowed)).toBe(false);
      expect(isPathWithinAllowedDirectories('/home/user/project/file', allowed)).toBe(false);
    })