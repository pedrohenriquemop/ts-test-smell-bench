it('blocks similar directory names (prefix vulnerability)', () => {
    const allowed = ['/home/user/project'];
    expect(isPathWithinAllowedDirectories('/home/user/project2', allowed)).toBe(false);
    expect(isPathWithinAllowedDirectories('/home/user/project_backup', allowed)).toBe(false);
    expect(isPathWithinAllowedDirectories('/home/user/project-old', allowed)).toBe(false);
    expect(isPathWithinAllowedDirectories('/home/user/projectile', allowed)).toBe(false);
    expect(isPathWithinAllowedDirectories('/home/user/project.bak', allowed)).toBe(false);
  })