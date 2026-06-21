it('handles multiple allowed directories', () => {
    const allowed = ['/home/user/project1', '/home/user/project2'];
    expect(isPathWithinAllowedDirectories('/home/user/project1/src', allowed)).toBe(true);
    expect(isPathWithinAllowedDirectories('/home/user/project2/src', allowed)).toBe(true);
    expect(isPathWithinAllowedDirectories('/home/user/project3', allowed)).toBe(false);
    expect(isPathWithinAllowedDirectories('/home/user/project1_backup', allowed)).toBe(false);
    expect(isPathWithinAllowedDirectories('/home/user/project2-old', allowed)).toBe(false);
  })