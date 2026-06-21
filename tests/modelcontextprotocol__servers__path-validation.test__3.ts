it('blocks paths outside allowed directories', () => {
    const allowed = ['/home/user/project'];
    expect(isPathWithinAllowedDirectories('/home/user/other', allowed)).toBe(false);
    expect(isPathWithinAllowedDirectories('/etc/passwd', allowed)).toBe(false);
    expect(isPathWithinAllowedDirectories('/home/user', allowed)).toBe(false);
    expect(isPathWithinAllowedDirectories('/', allowed)).toBe(false);
  })