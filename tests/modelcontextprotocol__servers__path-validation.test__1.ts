it('allows subdirectories', () => {
    const allowed = ['/home/user/project'];
    expect(isPathWithinAllowedDirectories('/home/user/project/src', allowed)).toBe(true);
    expect(isPathWithinAllowedDirectories('/home/user/project/src/index.js', allowed)).toBe(true);
    expect(isPathWithinAllowedDirectories('/home/user/project/deeply/nested/file.txt', allowed)).toBe(true);
  })