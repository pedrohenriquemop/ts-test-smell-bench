it('allows exact directory match', () => {
    const allowed = ['/home/user/project'];
    expect(isPathWithinAllowedDirectories('/home/user/project', allowed)).toBe(true);
  })