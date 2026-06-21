it('handles Unix-style paths on Unix', () => {
      if (path.sep === '/') {
        const allowed = ['/home/user/project'];
        expect(isPathWithinAllowedDirectories('/home/user/project', allowed)).toBe(true);
        expect(isPathWithinAllowedDirectories('/home/user/project/src', allowed)).toBe(true);
        expect(isPathWithinAllowedDirectories('/home/user/project2', allowed)).toBe(false);
      }
    })