it('handles paths with special characters', () => {
    const allowed = ['/home/user/my-project (v2)'];

    expect(isPathWithinAllowedDirectories('/home/user/my-project (v2)', allowed)).toBe(true);
    expect(isPathWithinAllowedDirectories('/home/user/my-project (v2)/src', allowed)).toBe(true);
    expect(isPathWithinAllowedDirectories('/home/user/my-project (v2)_backup', allowed)).toBe(false);
    expect(isPathWithinAllowedDirectories('/home/user/my-project', allowed)).toBe(false);
  })